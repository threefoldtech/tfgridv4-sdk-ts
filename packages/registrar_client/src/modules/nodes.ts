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
    const headers = createAuthHeader(node.twin_id, this.client.privateKey);
    try {
      const data = await this.client.post<NodeRegistrationResponse>(this.nodeUri, node, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to register node: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async listNodes(filter: NodesFilter): Promise<Node[]> {
    try {
      const data = await this.client.get<Node[]>(this.nodeUri, {
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
    const headers = createAuthHeader(twinID, this.client.privateKey);
    try {
      const data = await this.client.patch<Node>(`${this.nodeUri}/${nodeID}`, node, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to update node: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async reportNodeUptime(nodeID: number, twinID: number, uptime: UptimeReportRequest): Promise<any> {
    const headers = createAuthHeader(twinID, this.client.privateKey);
    try {
      const data = await this.client.post<any>(`${this.nodeUri}/${nodeID}/uptime`, uptime, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to report node uptime: ${e.response?.status} ${e.response?.statusText}`);
    }
  }
}
