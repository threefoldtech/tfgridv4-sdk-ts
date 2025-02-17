export interface Farm {
  createdAt: string;
  dedicated: boolean;
  farm_id: number;
  farm_name: string;
  nodes: any[];
  twin_id: number;
  updatedAt: string;
}
export interface FarmsFilter {
  farm_name?: string;
  farm_id?: number;
  twin_id?: number;
  page?: number;
  size?: number;
}
