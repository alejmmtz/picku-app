import Boom from '@hapi/boom';
import type { PoolClient } from 'pg';
import { pool } from '../../config/database.js';
import type { UUID } from '../../shared/storage/shared.types.js';
import type {
  CreateOrderDTO,
  OrderActorRole,
  OrderResponseDTO,
  OrderStatus,
  UpdateOrderDTO,
} from './order.types.js';
import { OrderStatus as OrderStatusEnum } from './order.types.js';

type OrderFilters = {
  id?: number;
  consumerId?: UUID;
  entrepreneurId?: UUID;
};

type OrderActor = {
  userId: UUID;
  role: OrderActorRole;
};

type EntrepreneurOrderContext = {
  id: UUID;
  is_active: boolean;
  owner_id: UUID;
};

type ProductRow = {
  id: number;
  entrepreneur_id: UUID;
  price: number;
  is_available: boolean;
};

const normalizeProductRow = (
  product: ProductRow & { id: number | string; price: number | string }
): ProductRow => ({
  ...product,
  id: Number(product.id),
  price: Number(product.price),
});

const generatePickupCode = (): string => {
  return Math.random().toString(36).substring(2, 7).toUpperCase();
};

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatusEnum.REQUESTED]: [OrderStatusEnum.ACCEPTED, OrderStatusEnum.DECLINED],
  [OrderStatusEnum.ACCEPTED]: [OrderStatusEnum.DELIVERING],
  [OrderStatusEnum.DELIVERING]: [OrderStatusEnum.DELIVERED],
  [OrderStatusEnum.DECLINED]: [],
  [OrderStatusEnum.DELIVERED]: [],
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

const normalizeProducts = (
  products: CreateOrderDTO['products']
): Array<{ product_id: number; quantity: number }> => {
  const quantityMap = new Map<number, number>();

  for (const item of products) {
    quantityMap.set(
      item.product_id,
      (quantityMap.get(item.product_id) ?? 0) + item.quantity
    );
  }

  return [...quantityMap.entries()].map(([product_id, quantity]) => ({
    product_id,
    quantity,
  }));
};

const getEntrepreneurIdByOwnerId = async (
  userId: UUID,
  client: Pick<PoolClient, 'query'> = pool
): Promise<UUID | null> => {
  const { rows } = await client.query<{ id: UUID }>(
    'SELECT id FROM entrepreneurs WHERE student_id = $1',
    [userId]
  );

  return rows[0]?.id ?? null;
};

const getRequiredEntrepreneurIdByOwnerId = async (
  userId: UUID,
  client: Pick<PoolClient, 'query'> = pool
): Promise<UUID> => {
  const entrepreneurId = await getEntrepreneurIdByOwnerId(userId, client);

  if (!entrepreneurId) {
    throw Boom.notFound('Entrepreneur not found for this user');
  }

  return entrepreneurId;
};

const getEntrepreneurOrderContext = async (
  entrepreneurId: UUID,
  client: Pick<PoolClient, 'query'> = pool
): Promise<EntrepreneurOrderContext> => {
  const { rows } = await client.query<{
    id: UUID;
    is_active: boolean;
    student_id: UUID;
  }>(
    `SELECT
       id,
       is_active,
       student_id
     FROM entrepreneurs
     WHERE id = $1`,
    [entrepreneurId]
  );

  const entrepreneur = rows[0];

  if (!entrepreneur) {
    throw Boom.badRequest('Entrepreneur not found');
  }

  return {
    id: entrepreneur.id,
    is_active: entrepreneur.is_active,
    owner_id: entrepreneur.student_id,
  };
};

const fetchProductsByIds = async (
  productIds: number[],
  client: Pick<PoolClient, 'query'> = pool
): Promise<Map<number, ProductRow>> => {
  const { rows } = await client.query<ProductRow>(
    `SELECT id, entrepreneur_id, price, is_available
     FROM products
     WHERE id = ANY($1::bigint[])`,
    [productIds]
  );

  return new Map(
    rows.map((product) => {
      const normalizedProduct = normalizeProductRow(
        product as ProductRow & { id: number | string; price: number | string }
      );

      return [normalizedProduct.id, normalizedProduct] as const;
    })
  );
};

const fetchOrdersQuery = async (
  filters: OrderFilters = {}
): Promise<OrderResponseDTO[]> => {
  const conditions: string[] = [];
  const params: Array<number | UUID> = [];

  if (filters.id !== undefined) {
    params.push(filters.id);
    conditions.push(`o.id = $${params.length}`);
  }

  if (filters.consumerId !== undefined) {
    params.push(filters.consumerId);
    conditions.push(`o.consumer_id = $${params.length}`);
  }

  if (filters.entrepreneurId !== undefined) {
    params.push(filters.entrepreneurId);
    conditions.push(`o.entrepreneur_id = $${params.length}`);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const query = `
    SELECT
      o.id,
      o.consumer_id,
      o.entrepreneur_id,
      o.status,
      o.total_price,
      o.pickup_code,
      o.delivery_notes,
      o.cancel_reason,
      o.created_at,
      o.updated_at,
      json_build_object(
        'id', u.id,
        'name', u.name,
        'phone', u.phone
      ) AS customer,
      json_build_object(
        'id', e.id,
        'name', e.name,
        'category', e.category,
        'contact_info', e.contact_info,
        'img', e.img
      ) AS entrepreneur,
      COALESCE((
        SELECT json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'name', p.name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'subtotal', oi.quantity * oi.unit_price,
            'img', p.img
          )
          ORDER BY oi.id
        )
        FROM order_items oi
        JOIN products p ON p.id = oi.product_id
        WHERE oi.order_id = o.id
      ), '[]') AS items
    FROM orders o
    JOIN users u ON o.consumer_id = u.id
    JOIN entrepreneurs e ON o.entrepreneur_id = e.id
    ${whereClause}
    ORDER BY o.created_at DESC
  `;

  const { rows } = await pool.query(query, params);
  return rows as OrderResponseDTO[];
};

const resolveOrderFiltersForActor = async (
  actor: OrderActor,
  orderId?: number
): Promise<OrderFilters> => {
  if (actor.role === 'consumer') {
    return {
      ...(orderId !== undefined ? { id: orderId } : {}),
      consumerId: actor.userId,
    };
  }

  const entrepreneurId = await getRequiredEntrepreneurIdByOwnerId(actor.userId);

  return {
    ...(orderId !== undefined ? { id: orderId } : {}),
    entrepreneurId,
  };
};

export const getOrdersService = async (
  userId: UUID,
  role: OrderActorRole
): Promise<OrderResponseDTO[]> => {
  if (role === 'consumer') {
    return fetchOrdersQuery({ consumerId: userId });
  }

  const entrepreneurId = await getEntrepreneurIdByOwnerId(userId);

  if (!entrepreneurId) {
    return [];
  }

  return fetchOrdersQuery({ entrepreneurId });
};

export const getOrderByIdService = async (
  orderId: number,
  actor: OrderActor
): Promise<OrderResponseDTO> => {
  const filters = await resolveOrderFiltersForActor(actor, orderId);
  const [order] = await fetchOrdersQuery(filters);

  if (!order) {
    throw Boom.notFound('Order not found');
  }

  return order;
};

export const createOrderService = async (
  dto: CreateOrderDTO,
  consumerId: UUID
): Promise<OrderResponseDTO> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const entrepreneur = await getEntrepreneurOrderContext(
      dto.entrepreneur_id,
      client
    );

    if (!entrepreneur.is_active) {
      throw Boom.badRequest('This shop is closed and cannot receive orders');
    }

    if (entrepreneur.owner_id === consumerId) {
      throw Boom.badRequest('You cannot place orders in your own shop');
    }

    const normalizedProducts = normalizeProducts(dto.products);
    const productIds = normalizedProducts.map((item) => item.product_id);
    const productsById = await fetchProductsByIds(productIds, client);

    if (productsById.size !== productIds.length) {
      const missingProduct = productIds.find((id) => !productsById.has(id));
      throw Boom.badRequest(`Product ${missingProduct} not found`);
    }

    let calculatedTotal = 0;
    const itemsData = normalizedProducts.map((item) => {
      const product = productsById.get(item.product_id);

      if (!product) {
        throw Boom.badRequest(`Product ${item.product_id} not found`);
      }

      if (product.entrepreneur_id !== dto.entrepreneur_id) {
        throw Boom.badRequest(
          `Product ${item.product_id} does not belong to the selected entrepreneur`
        );
      }

      if (!product.is_available) {
        throw Boom.badRequest(
          `Product ${item.product_id} is not currently available`
        );
      }

      calculatedTotal += product.price * item.quantity;

      return {
        ...item,
        unitPrice: product.price,
      };
    });

    const pickupCode = generatePickupCode();

    const {
      rows: [newOrder],
    } = await client.query<{ id: number }>(
      `INSERT INTO orders (
         consumer_id,
         entrepreneur_id,
         status,
         total_price,
         pickup_code,
         delivery_notes,
         created_at
       )
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING id`,
      [
        consumerId,
        dto.entrepreneur_id,
        OrderStatusEnum.REQUESTED,
        calculatedTotal,
        pickupCode,
        dto.delivery_notes ?? null,
      ]
    );

    if (!newOrder) {
      throw Boom.internal('Order could not be created');
    }

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

    return getOrderByIdService(newOrder.id, {
      userId: consumerId,
      role: 'consumer',
    });
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateOrderService = async (
  orderId: number,
  dto: UpdateOrderDTO,
  actor: OrderActor
): Promise<OrderResponseDTO> => {
  if (actor.role !== 'entrepreneur') {
    throw Boom.forbidden('Only entrepreneurs can update orders');
  }

  const current = await getOrderByIdService(orderId, actor);

  if (dto.pickup_code !== undefined && dto.status !== OrderStatusEnum.DELIVERED) {
    throw Boom.badRequest(
      'Pickup code can only be provided when completing an order'
    );
  }

  if (dto.cancel_reason !== undefined && dto.status !== OrderStatusEnum.DECLINED) {
    throw Boom.badRequest(
      'Cancel reason can only be provided when declining an order'
    );
  }

  if (dto.status !== undefined) {
    validateStatusTransition(current.status, dto.status);
  }

  if (
    dto.status === OrderStatusEnum.DELIVERED &&
    dto.pickup_code?.trim() !== current.pickup_code
  ) {
    throw Boom.badRequest('Invalid pickup code');
  }

  const updates: string[] = [];
  const values: Array<string | number | null> = [];
  let paramIndex = 1;

  if (dto.status !== undefined) {
    updates.push(`status = $${paramIndex++}`);
    values.push(dto.status);
  }

  if (dto.status === OrderStatusEnum.DECLINED) {
    updates.push(`cancel_reason = $${paramIndex++}`);
    values.push(dto.cancel_reason ?? null);
  }

  if (updates.length === 0) {
    throw Boom.badRequest('No valid fields to update');
  }

  updates.push(`updated_at = NOW()`);

  await pool.query(
    `UPDATE orders
     SET ${updates.join(', ')}
     WHERE id = $${paramIndex}`,
    [...values, orderId]
  );

  return getOrderByIdService(orderId, actor);
};
