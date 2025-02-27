import { Farm } from "./farm";

export interface Account {
  created_at: string;
  public_key: string;
  twin_id: number;
  relays: string[];
  rmb_enc_key: string;
  farms: Farm[];
  updated_at: string;
}

export interface CreateAccountRequest {
  public_key: string;
  relays: string[];
  rmb_enc_key: string;
  signature: string;
  timestamp: number;
}

export interface UpdateAccountRequest {
  relays?: string[];
  rmb_enc_key?: string;
}
