import { RegistrarClient } from "../../client/client";
import { NodeRegistrationRequest, NodesFilter, UpdateNodeRequest, UptimeReportRequest } from "./types";
import * as tweetnacl from "tweetnacl";
import * as base64 from "base64-js";

export class Nodes {
  private client: RegistrarClient;
  private readonly nodeUri = "/nodes";

  constructor() {
    this.client = new RegistrarClient();
  }

  async registerNode(node: NodeRegistrationRequest): Promise<number | null> {
    const twinID = node.twin_id;
    const timestamp = Math.floor(Date.now() / 1000);
    const challenge = `${timestamp}:${twinID}`;
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key is not found");
    }
    const signature = tweetnacl.sign.detached(Buffer.from(challenge, "utf-8"), base64.toByteArray(privateKey));
    const config = {
      headers: {
        "X-Auth": `${Buffer.from(challenge).toString("base64")}:${base64.fromByteArray(signature)}`,
      },
    };
    try {
      const data = await this.client.post<number>(this.nodeUri, node, config);
      return data;
    } catch (e) {
      console.error("Failed to register node: ", e);
      return null;
    }
  }
  async listNodes(filter: NodesFilter): Promise<Node[] | null> {
    try {
      const data = await this.client.get<Node[]>(this.nodeUri, {
        params: filter,
      });
      return data;
    } catch (e) {
      console.error("Failed to get nodes: ", e);
      return null;
    }
  }

  async getNode(nodeID: number): Promise<Node | null> {
    try {
      const data = await this.client.get<Node>(`${this.nodeUri}/${nodeID}`);
      return data;
    } catch (e) {
      console.error("Failed to get node: ", e);
      return null;
    }
  }

  async updateNode(nodeID: number, twinID: number, node: UpdateNodeRequest): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000);
    const challenge = `${timestamp}:${twinID}`;
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key is not found");
    }
    const signature = tweetnacl.sign.detached(Buffer.from(challenge, "utf-8"), base64.toByteArray(privateKey));
    const config = {
      headers: {
        "X-Auth": `${Buffer.from(challenge).toString("base64")}:${base64.fromByteArray(signature)}`,
      },
    };
    try {
      const data = await this.client.patch<Node>(`${this.nodeUri}/${nodeID}`, node, config);
      return data;
    } catch (e) {
      console.error("Failed to update node: ", e);
      return null;
    }
  }

  async reportNodeUptime(nodeID: number, twinID: number, uptime: UptimeReportRequest): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000);
    const challenge = `${timestamp}:${twinID}`;
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      throw new Error("Private key is not found");
    }
    const signature = tweetnacl.sign.detached(Buffer.from(challenge, "utf-8"), base64.toByteArray(privateKey));
    const config = {
      headers: {
        "X-Auth": `${Buffer.from(challenge).toString("base64")}:${base64.fromByteArray(signature)}`,
      },
    };
    try {
      const data = await this.client.post<any>(`${this.nodeUri}/${nodeID}/uptime`, uptime, config);
      return data;
    } catch (e) {
      console.error("Failed to report node uptime: ", e);
      return null;
    }
  }
}
