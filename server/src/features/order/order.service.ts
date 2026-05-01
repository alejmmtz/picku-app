import Boom from '@hapi/boom';
import { pool } from '../../config/database.js';
import type {
  CreateOrderDTO,
  UpdateOrderDTO,
  OrderResponseDTO,
} from './order.types.js';
import { OrderStatus } from './order.types.js';
import type { UUID } from '../../shared/storage/shared.types.js';

const generatePickupCode = (): string => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.REQUESTED]: [OrderStatus.ACCEPTED, OrderStatus.DECLINED],
  [OrderStatus.ACCEPTED]: [OrderStatus.DELIVERING],
  [OrderStatus.DELIVERING]: [OrderStatus.DELIVERED],
  [OrderStatus.DECLINED]: [],
  [OrderStatus.DELIVERED]: [],
};

const validateStatusTransition = (
  current: OrderStatus,
  next: OrderStatus
): void => {
  const allowed = VALID_TRANSITIONS[current];

  if (!allowed.includes(next)) {
    throw Boom.badRequest(
      `Cannot transition from "${current}" to "${next}". ` +
        `Allowed: ${allowed.join(', ') || 'none'}`
    );
  }
};

const fetchOrdersQuery = async (
  filter?:
    | { column: 'consumer_id' | 'entrepreneur_id'; value: UUID }
    | { column: 'id'; value: number }
): Promise<OrderResponseDTO[]> => {
  const whereClause = filter ? `WHERE o.${filter.column} = $1` : '';
  const params = filter ? [filter.value] : [];

  const query = `
    SELECT
      o.id, o.status, o.total_price, o.pickup_code,
      o.delivery_notes, o.cancel_reason, o.created_at, o.updated_at,
      json_build_object(
        'id', u.id, 'name', u.name, 'phone', u.phone
      ) AS customer,
      json_build_object(
        'id', e.id, 'name', e.name, 'category', e.category,
        'contact_info', e.contact_info, 'img', e.img,
        'entrepreneur_position', e.entrepreneur_position,
        'campus_location_id', e.campus_location_id
      ) AS entrepreneur,
      json_build_object(
        'estimated_distance', o.estimated_distance,
        'estimated_time',     o.estimated_time,
        'user_position',      o.user_position,
        'campus_location_id', o.campus_location_id,
        'location_name',      cl.name
      ) AS tracking,
      COALESCE((
        SELECT json_agg(json_build_object(
          'id',         oi.id,
          'product_id', oi.product_id,
          'name',       p.name,
          'quantity',   oi.quantity,
          'unit_price', oi.unit_price,
          'subtotal',   oi.quantity * oi.unit_price,
          'img',        p.img
        ))
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = o.id
      ), '[]') AS items
    FROM orders o
    JOIN  users        u  ON o.consumer_id       = u.id
    JOIN  entrepreneurs e  ON o.entrepreneur_id   = e.id
    LEFT JOIN campus_locations cl ON o.campus_location_id = cl.id
    ${whereClause}
    ORDER BY o.created_at DESC
  `;

  const { rows } = await pool.query(query, params);
  return rows as OrderResponseDTO[];
};

export const getOrdersService = async (
  userId: UUID,
  role: 'consumer' | 'entrepreneur'
): Promise<OrderResponseDTO[]> => {
  const column = role === 'consumer' ? 'consumer_id' : 'entrepreneur_id';
  return fetchOrdersQuery({ column, value: userId });
};

export const getOrderByIdService = async (
  orderId: number
): Promise<OrderResponseDTO> => {
  const [order] = await fetchOrdersQuery({ column: 'id', value: orderId });

  if (!order) throw Boom.notFound('Order not found');

  return order;
};

export const createOrderService = async (
  dto: CreateOrderDTO,
  consumerId: UUID
): Promise<OrderResponseDTO> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let calculatedTotal = 0;
    const pickupCode = generatePickupCode();
    const itemsData = [];

    for (const item of dto.products) {
      const { rows } = await client.query(
        'SELECT price FROM products WHERE id = $1',
        [item.product_id]
      );

      if (rows.length === 0)
        throw Boom.badRequest(`Product ${item.product_id} not found`);

      const unitPrice = rows[0].price as number;
      calculatedTotal += unitPrice * item.quantity;
      itemsData.push({ ...item, unitPrice });
    }

    const {
      rows: [newOrder],
    } = await client.query(
      `INSERT INTO orders (
        consumer_id, entrepreneur_id, status, total_price, pickup_code,
        delivery_notes, campus_location_id, user_position, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) RETURNING id`,
      [
        consumerId,
        dto.entrepreneur_id,
        OrderStatus.REQUESTED,
        calculatedTotal,
        pickupCode,
        dto.delivery_notes,
        dto.campus_location_id,
        dto.user_position,
      ]
    );

    await Promise.all(
      itemsData.map((item) =>
        client.query(
          `INSERT INTO order_items (order_id, product_id, quantity, unit_price)
           VALUES ($1, $2, $3, $4)`,
          [newOrder.id, item.product_id, item.quantity, item.unitPrice]
        )
      )
    );

    await client.query('COMMIT');

    return getOrderByIdService(newOrder.id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateOrderService = async (
  orderId: number,
  dto: UpdateOrderDTO
): Promise<OrderResponseDTO> => {
  const current = await getOrderByIdService(orderId);

  if (dto.status !== undefined) {
    validateStatusTransition(current.status, dto.status);
  }

  const updates: string[] = [];
  const values: (string | number | null)[] = [];
  let paramIndex = 1;

  if (dto.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(dto.status);
  }
  if (dto.pickup_code !== undefined) {
    updates.push(`pickup_code = $${paramIndex++}`);
    values.push(dto.pickup_code);
  }
  if (dto.cancel_reason !== undefined) {
    updates.push(`cancel_reason = $${paramIndex++}`);
    values.push(dto.cancel_reason);
  }

  if (updates.length === 0) throw Boom.badRequest('No valid fields to update');

  updates.push(`updated_at = NOW()`);
  values.push(orderId);

  await pool.query(
    `UPDATE orders SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  return getOrderByIdService(orderId);
};
