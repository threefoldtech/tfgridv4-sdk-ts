export interface Node {
  approved: boolean;
  created_at: string;
  farm_id: number;
  interfaces: Interfaces[];
  location: Location;
  node_id: number;
  resources: Resources;
  secure_boot: boolean;
  serial_number: string;
  twin_id: number;
  updated_at: string;
  uptime: UptimeReport[];
  virtualized: boolean;
}

interface UptimeReport {
  created_at: string;
  duration: number;
  id: number;
  node_id: number;
  timestamp: string;
  was_restart: boolean;
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

export interface NodeRegistrationRequest extends UpdateNodeRequest {
  twin_id: number;
}

export interface UpdateNodeRequest {
  farm_id: number;
  interfaces: Interfaces[];
  location: Location;
  resources: Resources;
  secure_boot?: boolean;
  serial_number: string;
  virtualized?: boolean;
}

interface Interfaces {
  ips: string[];
  mac: string;
  name: string;
}

export interface NodesFilter {
  farm_id?: number;
  node_id?: number;
  twin_id?: number;
  status?: string;
  health?: boolean;
  page?: number;
  size?: number;
}

export interface UptimeReportRequest {
  timestamp: number;
  uptime: number;
}

export interface NodeRegistrationResponse {
  node_id: number;
}
