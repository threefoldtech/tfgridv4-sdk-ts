import { Node } from "./node";

export interface Farm {
  created_at: string;
  dedicated: boolean;
  farm_id: number;
  farm_name: string;
  nodes: Node[];
  twin_id: number;
  updated_at: string;
  stellar_address: string;
}
export interface FarmsFilter {
  farm_name?: string;
  farm_id?: number;
  twin_id?: number;
  page?: number;
  size?: number;
}

export interface FarmCreationResponse {
  farm_id: number;
}

export interface FarmUpdateRequest {
  farm_name: string;
  stellar_address?: string;
}