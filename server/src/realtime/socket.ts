import { Server } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import { supabase } from '../config/supabase.js';
import { getEntrepreneurByOwnerIdService } from '../features/entrepreneurs/ent.service.js';
import type { OrderResponseDTO } from '../features/order/order.types.js';

let io: Server | null = null;

const userRoom = (userId: string) => `user:${userId}`;
const entrepreneurRoom = (entrepreneurId: string) => `entrepreneur:${entrepreneurId}`;

export const initRealtimeServer = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  io.on('connection', async (socket) => {
    try {
      const token =
        typeof socket.handshake.auth.token === 'string'
          ? socket.handshake.auth.token
          : '';

      if (!token) {
        socket.disconnect(true);
        return;
      }

      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data.user) {
        socket.disconnect(true);
        return;
      }

      socket.join(userRoom(data.user.id));

      if (data.user.user_metadata?.role === 'entrepreneur') {
        const entrepreneur = await getEntrepreneurByOwnerIdService(data.user.id);

        if (entrepreneur) {
          socket.join(entrepreneurRoom(entrepreneur.id));
        }
      }
    } catch {
      socket.disconnect(true);
    }
  });

  return io;
};

export const emitOrderChanged = (order: OrderResponseDTO): void => {
  if (!io) return;

  io.to(userRoom(order.consumer_id)).emit('orders:changed', order);
  io.to(entrepreneurRoom(order.entrepreneur_id)).emit('orders:changed', order);
};
