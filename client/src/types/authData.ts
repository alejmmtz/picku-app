import type { User, Session } from "@supabase/supabase-js";

export interface AuthData {
  user: User;
  session: Session;
}
