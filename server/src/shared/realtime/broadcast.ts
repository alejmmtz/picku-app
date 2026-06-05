import { supabase, supabaseAdmin } from '../../config/supabase.js';

const realtimePublisher = supabaseAdmin ?? supabase;

type RealtimeChannelWithHttpSend = {
  httpSend: (
    event: string,
    payload: Record<string, unknown>,
    opts?: { timeout?: number }
  ) => Promise<unknown>;
};

/**
 * Server-side broadcast delivery via Supabase REST (httpSend).
 * Clients subscribed to the same channel topic receive the event over WebSocket.
 */
export const broadcastHttp = async (
  channelName: string,
  event: string,
  payload: Record<string, unknown>
): Promise<void> => {
  const channel = realtimePublisher.channel(
    channelName
  ) as unknown as RealtimeChannelWithHttpSend;

  await channel.httpSend(event, payload);
};
