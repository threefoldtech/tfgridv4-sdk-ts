import { RegistrarClient } from "../client/client";

export class Zos {
  private client: RegistrarClient;

  private readonly zosUri = "/zos";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async getZosVersion(): Promise<string | null> {
    try {
      const data = await this.client.get<string>(`${this.zosUri}/version`);
      return data;
    } catch (e: any) {
      throw new Error(`Failed to get zos version: ${e.response?.status} ${e.response?.statusText}`);
    }
  }
}
