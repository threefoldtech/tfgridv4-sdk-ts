import { RegistrarClient } from "../../client/client";
import { NodeRegistrationRequest, NodesFilter, UpdateNodeRequest, UptimeReportRequest, Node, NodeRegistrationResponse } from "./types";
import { createAuthHeader } from "../../utils";

export class Nodes {
  private client: RegistrarClient;
  private readonly nodeUri = "/nodes";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async registerNode(node: NodeRegistrationRequest): Promise<NodeRegistrationResponse> {
    const headers = createAuthHeader(node.twin_id, this.client.privateKey);

    const data = await this.client.post<NodeRegistrationResponse>(this.nodeUri, node, { headers });
    return data;
  }
  async listNodes(filter: NodesFilter): Promise<Node[]> {
    const data = await this.client.get<Node[]>(this.nodeUri, {
      params: filter,
    });
    return data;
  }

  async getNode(nodeID: number): Promise<Node> {
    const data = await this.client.get<Node>(`${this.nodeUri}/${nodeID}`);
    return data;
  }

  async updateNode(nodeID: number, twinID: number, node: UpdateNodeRequest): Promise<any> {
    const headers = createAuthHeader(twinID, this.client.privateKey);

    const data = await this.client.patch<Node>(`${this.nodeUri}/${nodeID}`, node, { headers });
    return data;
  }

  async reportNodeUptime(nodeID: number, twinID: number, uptime: UptimeReportRequest): Promise<any> {
    const headers = createAuthHeader(twinID, this.client.privateKey);
    const data = await this.client.post<any>(`${this.nodeUri}/${nodeID}/uptime`, uptime, { headers });
    return data;
  }
}
