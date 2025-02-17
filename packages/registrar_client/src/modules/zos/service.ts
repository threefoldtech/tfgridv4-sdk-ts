import { RegistrarClient } from "../../client/client";
import * as tweetnacl from "tweetnacl";
import * as base64 from "base64-js";

export class Zos {
  private client: RegistrarClient;

  private readonly zosUri = "/zos";

  constructor() {
    this.client = new RegistrarClient();
  }

  async getZosVersion(): Promise<string | null> {
    try {
      const data = await this.client.get<string>(`${this.zosUri}/version`);
      return data;
    } catch (e) {
      console.error("Failed to get zos version: ", e);
      return null;
    }
  }
}
