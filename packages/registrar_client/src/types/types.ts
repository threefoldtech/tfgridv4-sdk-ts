export interface Farm {
  farm_id: number;
  farm_name: string;
  twin_id: number;
  dedicated: boolean;
  createdAt: string;
  UpdatedAt: string;
  nodes: any[];
}
interface NetworkInterface {
  ips: string;
  mac: string;
  name: string;
}
interface Location {
  city: string;
  country: string;
  latitude: string;
  longitude: string;
}
interface Resources {
  cru: number;
  hru: number;
  mru: number;
  sru: number;
}
interface Uptime {
  createdAt: string;
  duration: number;
  id: number;
  node_id: number;
  timestamp: string;
  wasRestart: boolean;
}

export interface Node {
  approved: boolean;
  createdAt: string;
  farm_id: number;
  interfaces: NetworkInterface[];
  location: Location;
  node_id: number;
  resources: Resources;
  secureBoot: boolean;
  serialNumber: string;
  twin_id: number;
  updatedAt: string;
  virtualized: boolean;
  uptime?: Uptime[];
}
export interface Account {
  twin_id: number;
  relays: string[];
  rmb_enc_key: string;
  CreatedAt: string;
  UpdatedAt: string;
  public_key: string;
  Farms: any[];
}
export interface AccountOptions {
  twin_id?: number;
  public_key?: string;
}

export interface AccountModel {
  public_key: string;
  relays: string[];
  rmb_enc_key: string;
  signature: string;
  timestamp: number;
}

export interface FarmsFilters {
  farm_name?: string;
  farm_id?: number;
  twin_id?: number;
  page?: number;
  size?: number;
}

export interface NodesFilters {
  node_id?: number;
  farm_id?: number;
  twin_id?: number;
  status?: string;
  healthy?: boolean;
  page?: number;
  size?: number;
}
