import { RegistrarClient } from "../../client/client";
import { Farm, FarmsFilter } from "./types";
import { createAuthHeader } from "../../utils";

export class Farms {
  private client: RegistrarClient;
  private readonly farmUri = "/farms";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async createFarm(farm: Partial<Farm>): Promise<number> {
    const twinID = farm.twin_id;
    if (!twinID) {
      throw new Error("TwinID is not found");
    }
    const farmName = farm.farm_name;
    if (!farmName || farmName.length < 1 || farmName.length > 40) {
      throw new Error("Farm name must be between 1 and 40 characters");
    }
    const headers = createAuthHeader(twinID, this.client.privateKey);

    const data = await this.client.post<number>(this.farmUri, farm, { headers });
    return data;
  }

  async listFarms(filter: FarmsFilter): Promise<Farm[]> {
    const data = await this.client.get<Farm[]>(this.farmUri, { params: filter });
    return data;
  }

  async getFarm(farmID: number): Promise<Farm> {
    const data = await this.client.get<Farm>(`${this.farmUri}/${farmID}`);
    return data;
  }

  async updateFarm(farmID: number, twinID: number, name: string): Promise<any> {
    if (!name || name.length < 1 || name.length > 40) {
      throw new Error("Farm name must be between 1 and 40 characters");
    }
    const headers = createAuthHeader(twinID, this.client.privateKey);

    const data = await this.client.patch<any>(`${this.farmUri}/${farmID}`, { farm_name: name }, { headers });
    return data;
  }
}
