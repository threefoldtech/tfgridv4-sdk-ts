import { RegistrarClient } from "../client/client";
import {
  NodeRegistrationRequest,
  NodesFilter,
  UpdateNodeRequest,
  UptimeReportRequest,
  Node,
  NodeRegistrationResponse,
} from "../types/node";
import { createAuthHeader } from "../utils";

export class Nodes {
  private client: RegistrarClient;
  private readonly nodeUri = "/nodes";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async registerNode(node: NodeRegistrationRequest): Promise<NodeRegistrationResponse> {
    this._validateNodeData(node);
    const headers = await createAuthHeader(node.twin_id, this.client.mnemonicOrSeed, this.client.keypairType);
    try {
      const data = await this.client.post<NodeRegistrationResponse>(`${this.nodeUri}/`, node, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to register node: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async listNodes(filter: NodesFilter): Promise<Node[]> {
    try {
      const data = await this.client.get<Node[]>(`${this.nodeUri}/`, {
        params: filter,
      });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to list nodes: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async getNode(nodeID: number): Promise<Node> {
    try {
      const data = await this.client.get<Node>(`${this.nodeUri}/${nodeID}`);
      return data;
    } catch (e: any) {
      throw new Error(`Failed to get node: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async updateNode(nodeID: number, twinID: number, node: UpdateNodeRequest): Promise<any> {
    this._validateNodeData(node);
    const headers = await createAuthHeader(twinID, this.client.mnemonicOrSeed, this.client.keypairType);
    try {
      const data = await this.client.patch<Node>(`${this.nodeUri}/${nodeID}`, node, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to update node: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async reportNodeUptime(nodeID: number, twinID: number, uptime: UptimeReportRequest): Promise<any> {
    const headers = await createAuthHeader(twinID, this.client.mnemonicOrSeed, this.client.keypairType);
    try {
      const data = await this.client.post<any>(`${this.nodeUri}/${nodeID}/uptime`, uptime, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to report node uptime: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  _validateNodeData(node: NodeRegistrationRequest | UpdateNodeRequest): void {
    if ("twin_id" in node && node.twin_id <= 0) {
      throw new Error("Invalid node: twinId");
    }
    if (node.farm_id <= 0) {
      throw new Error("Invalid node: farmId");
    }
    this._validateResources(node.resources);
    this._validateLocation(node.location);
    node.interfaces.forEach(iface => {
      this._validateIp(iface.ips);
      this._validateMac(iface.mac);
    });
  }

  _validateResources(resources: any): void {
    ["cru", "hru", "mru", "sru"].forEach(key => {
      if (resources[key] < 0) {
        throw new Error(`Invalid resources: ${key}`);
      }
    });
  }

  _validateLocation(location: any): void {
    ["city", "country", "latitude", "longitude"].forEach(key => {
      if (location[key].length === 0) {
        throw new Error(`Invalid location: ${key}`);
      }
    });
  }

  _validateIp(ip: string): void {
    const parts = ip.split(".");
    if (parts.length !== 4) {
      throw new Error("Invalid interfaces: ips");
    }
    parts.forEach(part => {
      const num = parseInt(part);
      if (isNaN(num) || num < 0 || num > 255) {
        throw new Error("Invalid interfaces: ips");
      }
    });
  }

  _validateMac(mac: string): void {
    const parts = mac.split(":");
    if (parts.length !== 6) {
      throw new Error("Invalid interfaces: mac");
    }
    parts.forEach(part => {
      const num = parseInt(part, 16);
      if (isNaN(num) || num < 0 || num > 255) {
        throw new Error("Invalid interfaces: mac");
      }
    });
  }
}
