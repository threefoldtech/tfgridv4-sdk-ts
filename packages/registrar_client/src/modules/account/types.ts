import { Farm } from "../farm/types";

export interface Account {
  createdAt: string;
  public_key: string;
  twin_id: number;
  relays: string[];
  rmb_enc_key: string;
  farms: Farm[];
  updatedAt: string;
}

export interface CreateAccountRequest {
  public_key: string;
  relays: string[];
  rmb_enc_key: string;
  signature: string;
  timestamp: number;
}

export interface UpdateAccountRequest {
  relays: string[];
  rmb_enc_key: string;
}
