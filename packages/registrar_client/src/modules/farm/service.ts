import { RegistrarClient } from "../../client/client";
import { Farm, FarmsFilter } from "./types";
import * as tweetnacl from "tweetnacl";
import * as base64 from "base64-js";

export class Farms {
  private client: RegistrarClient;
  private readonly farmUri = "/farms";

  constructor() {
    this.client = new RegistrarClient();
  }

  async createFarm(farm: Partial<Farm>): Promise<Farm | null> {
    const twinID = farm.twin_id;
    if (!twinID) {
      throw new Error("TwinID is not found");
    }
    const farmName = farm.farm_name;
    if (!farmName || farmName.length < 1 || farmName.length > 40) {
      throw new Error("Farm name must be between 1 and 40 characters");
    }
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
      const data = await this.client.post<Farm>(this.farmUri, farm, config);
      return data;
    } catch (e) {
      console.error("Failed to create farm: ", e);
      return null;
    }
  }

  async listFarms(filter: FarmsFilter): Promise<Farm[] | null> {
    try {
      const data = await this.client.get<Farm[]>(this.farmUri, { params: filter });
      return data;
    } catch (e) {
      console.error("Failed to get farms: ", e);
      return null;
    }
  }

  async getFarm(farmID: number): Promise<Farm | null> {
    try {
      const data = await this.client.get<Farm>(`${this.farmUri}/${farmID}`);
      return data;
    } catch (e) {
      console.error("Failed to get farm: ", e);
      return null;
    }
  }

  async updateFarm(farmID: number, twinID: number, name: string): Promise<any> {
    if (!name || name.length < 1 || name.length > 40) {
      throw new Error("Farm name must be between 1 and 40 characters");
    }
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
      const data = await this.client.patch<any>(`${this.farmUri}/${farmID}`, { farm_name: name }, config);
      return data;
    } catch (e) {
      console.error("Failed to update farm: ", e);
      return null;
    }
  }
}
