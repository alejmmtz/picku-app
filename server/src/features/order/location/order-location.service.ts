import Boom from '@hapi/boom';
import type { PoolClient } from 'pg';
import { pool } from '../../../config/database.js';
import { broadcastOrderLocationUpdate } from './order-location.broadcast.js';
import {
  distanceMeters,
  estimateTravelTimeSeconds,
  fromGeoJsonPoint,
  toCoordinates,
  toPostgisPointParams,
} from '../../../shared/geo/index.js';
import type { UUID } from '../../../shared/storage/shared.types.js';
import { OrderStatus } from '../order.types.js';
import { isKnownCampusLocationId } from './campus-locations.js';
import type {
  EntrepreneurLocationBurstDTO,
  EntrepreneurLocationUpdate,
  OrderLocationRow,
  OrderLocationService,
  OrderLocationSnapshot,
  ProcessEntrepreneurLocationBurstResult,
  SaveConsumerOrderLocationDTO,
  SaveConsumerOrderLocationResult,
} from './order-location.types.js';

const ACTIVE_ENTREPRENEUR_TRACKING_STATUSES: OrderStatus[] = [
  OrderStatus.ACCEPTED,
  OrderStatus.PREPARING,
  OrderStatus.DELIVERING,
];

type LocationActor = {
  userId: UUID;
  role: 'consumer' | 'entrepreneur';
};

const parseDbCoordinates = (
  value: OrderLocationRow['user_position']
): ReturnType<typeof toCoordinates> | null => {
  if (!value) {
    return null;
  }

  if ('type' in value && value.type === 'Point') {
    return fromGeoJsonPoint(value);
  }

  return toCoordinates(value);
};

const pickLatestEntrepreneurUpdate = (
  updates: EntrepreneurLocationUpdate[]
): { latest: EntrepreneurLocationUpdate; discarded: number } => {
  if (updates.length === 1) {
    return { latest: updates[0]!, discarded: 0 };
  }

  const sorted = [...updates].sort((a, b) => {
    const timeA = a.captured_at ? Date.parse(a.captured_at) : 0;
    const timeB = b.captured_at ? Date.parse(b.captured_at) : 0;
    return timeB - timeA;
  });

  return {
    latest: sorted[0]!,
    discarded: sorted.length - 1,
  };
};

const fetchOrderLocationRow = async (
  orderId: number,
  client: Pick<PoolClient, 'query'> = pool
): Promise<OrderLocationRow | null> => {
  const { rows } = await client.query<OrderLocationRow>(
    `SELECT
       o.id,
       o.consumer_id,
       o.entrepreneur_id,
       o.status,
       o.campus_location_id,
       ST_AsGeoJSON(o.user_position)::json AS user_position,
       o.estimated_distance,
       o.estimated_time
     FROM orders o
     WHERE o.id = $1`,
    [orderId]
  );

  return rows[0] ?? null;
};

const fetchEntrepreneurPosition = async (
  entrepreneurId: UUID,
  client: Pick<PoolClient, 'query'> = pool
): Promise<ReturnType<typeof parseDbCoordinates>> => {
  const { rows } = await client.query<{
    entrepreneur_position: OrderLocationRow['user_position'];
  }>(
    `SELECT ST_AsGeoJSON(entrepreneur_position)::json AS entrepreneur_position
     FROM entrepreneurs
     WHERE id = $1`,
    [entrepreneurId]
  );

  return parseDbCoordinates(rows[0]?.entrepreneur_position ?? null);
};

const assertOrderAccessibleByActor = async (
  order: OrderLocationRow,
  actor: LocationActor
): Promise<void> => {
  if (actor.role === 'consumer') {
    if (order.consumer_id !== actor.userId) {
      throw Boom.forbidden('You do not have access to this order');
    }
    return;
  }

  const { rows } = await pool.query<{ id: UUID }>(
    'SELECT id FROM entrepreneurs WHERE student_id = $1 AND id = $2',
    [actor.userId, order.entrepreneur_id]
  );

  if (!rows[0]) {
    throw Boom.forbidden('You do not have access to this order');
  }
};

export const saveConsumerOrderLocation = async (
  consumerId: UUID,
  dto: SaveConsumerOrderLocationDTO
): Promise<SaveConsumerOrderLocationResult> => {
  if (
    dto.campus_location_id !== undefined &&
    !isKnownCampusLocationId(dto.campus_location_id)
  ) {
    throw Boom.badRequest('Invalid campus location');
  }

  const order = await fetchOrderLocationRow(dto.order_id);

  if (!order) {
    throw Boom.notFound('Order not found');
  }

  if (order.consumer_id !== consumerId) {
    throw Boom.forbidden('You can only set location on your own orders');
  }

  if (order.user_position !== null) {
    throw Boom.conflict('Consumer location is immutable once set for an order');
  }

  const { longitude, latitude } = toPostgisPointParams(dto.user_position);

  const { rowCount } = await pool.query(
    `UPDATE orders
     SET user_position = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
         campus_location_id = $3,
         updated_at = NOW()
     WHERE id = $4
       AND consumer_id = $5
       AND user_position IS NULL`,
    [
      longitude,
      latitude,
      dto.campus_location_id ?? null,
      dto.order_id,
      consumerId,
    ]
  );

  if (rowCount === 0) {
    throw Boom.conflict('Consumer location could not be saved');
  }

  return {
    order_id: dto.order_id,
    user_position: dto.user_position,
    campus_location_id: dto.campus_location_id ?? null,
  };
};

export const processEntrepreneurLocationBurst = async (
  entrepreneurId: UUID,
  dto: EntrepreneurLocationBurstDTO
): Promise<ProcessEntrepreneurLocationBurstResult> => {
  const order = await fetchOrderLocationRow(dto.order_id);

  if (!order) {
    throw Boom.notFound('Order not found');
  }

  if (order.entrepreneur_id !== entrepreneurId) {
    throw Boom.forbidden('This order does not belong to the entrepreneur');
  }

  if (!ACTIVE_ENTREPRENEUR_TRACKING_STATUSES.includes(order.status)) {
    throw Boom.badRequest(
      'Entrepreneur location can only be updated for accepted or delivering orders'
    );
  }

  const { latest, discarded } = pickLatestEntrepreneurUpdate(dto.updates);
  const position = latest.position;
  const { longitude, latitude } = toPostgisPointParams(position);

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `UPDATE entrepreneurs
       SET entrepreneur_position = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
       WHERE id = $3`,
      [longitude, latitude, entrepreneurId]
    );

    const consumerPosition = parseDbCoordinates(order.user_position);

    let estimatedDistanceMeters: number | null = null;
    let estimatedTimeSeconds: number | null = null;

    if (consumerPosition) {
      estimatedDistanceMeters = distanceMeters(position, consumerPosition);
      estimatedTimeSeconds = estimateTravelTimeSeconds(estimatedDistanceMeters);

      await client.query(
        `UPDATE orders
         SET estimated_distance = $1,
             estimated_time = $2,
             updated_at = NOW()
         WHERE id = $3`,
        [estimatedDistanceMeters, estimatedTimeSeconds, dto.order_id]
      );
    }

    await client.query('COMMIT');

    await broadcastOrderLocationUpdate(
      dto.order_id,
      position,
      estimatedDistanceMeters,
      estimatedTimeSeconds
    );

    return {
      entrepreneur_id: entrepreneurId,
      order_id: dto.order_id,
      position,
      estimated_distance_meters: estimatedDistanceMeters,
      estimated_time_seconds: estimatedTimeSeconds,
      discarded_updates: discarded,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const getOrderLocationSnapshot = async (
  orderId: number,
  actor: LocationActor
): Promise<OrderLocationSnapshot> => {
  const order = await fetchOrderLocationRow(orderId);

  if (!order) {
    throw Boom.notFound('Order not found');
  }

  await assertOrderAccessibleByActor(order, actor);

  const entrepreneurPosition = await fetchEntrepreneurPosition(
    order.entrepreneur_id
  );

  return {
    order_id: order.id,
    consumer_id: order.consumer_id,
    entrepreneur_id: order.entrepreneur_id,
    status: order.status,
    campus_location_id: order.campus_location_id,
    user_position: parseDbCoordinates(order.user_position),
    entrepreneur_position: entrepreneurPosition,
    estimated_distance_meters: order.estimated_distance,
    estimated_time_seconds: order.estimated_time,
  };
};

/** Default implementation — inject or replace in tests. */
export const orderLocationService: OrderLocationService = {
  saveConsumerOrderLocation,
  processEntrepreneurLocationBurst,
  getOrderLocationSnapshot,
};
