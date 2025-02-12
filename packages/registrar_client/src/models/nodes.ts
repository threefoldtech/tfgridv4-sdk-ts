import { log } from "console";
import { Node } from "../types/types";
import Client from "../client/client";

class Nodes {
  protected readonly path = "/nodes";

  async listNodes(): Promise<Node[]> {
    try {
      const data: Node[] = await Client.get<Node[]>(this.path);
      return data;
    } catch (error) {
      log("Error fetching nodes:", error);
      return [];
    }
  }
  async getNode(nodeId: number): Promise<Node | null> {
    try {
      const data: Node = await Client.get<Node>(this.path, {
        params: { node_id: nodeId },
      });
      return data;
    } catch (error) {
      console.error(`Error fetching node with nodeId ${nodeId}:`, error);
      return null;
    }
  }
}

export default Nodes;
