import { RegistrarClient } from "../client/client";
import { Farm, FarmCreationResponse, FarmsFilter } from "../types/farm";
import { createAuthHeader } from "../utils";

const MAX_FARM_NAME_LENGTH = 40;
const MIN_FARM_NAME_LENGTH = 1;

export class Farms {
  private client: RegistrarClient;
  private readonly farmUri = "/farms";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async createFarm(farm: Partial<Farm>): Promise<FarmCreationResponse> {
    const twinID = farm.twin_id;
    if (!twinID) {
      throw new Error("TwinID is not found");
    }
    const farmName = farm.farm_name;
    if (!farmName || farmName.length <= MIN_FARM_NAME_LENGTH || farmName.length >= MAX_FARM_NAME_LENGTH) {
      throw new Error(
        `Farm name must have minimum ${MIN_FARM_NAME_LENGTH} and maximum ${MAX_FARM_NAME_LENGTH} characters`,
      );
    }
    const headers = createAuthHeader(twinID, this.client.privateKey);

    try {
      const data = await this.client.post<FarmCreationResponse>(this.farmUri, farm, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to create farm: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async listFarms(filter: FarmsFilter): Promise<Farm[]> {
    try {
      const data = await this.client.get<Farm[]>(this.farmUri, { params: filter });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to list farms: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async getFarm(farmID: number): Promise<Farm> {
    try {
      const data = await this.client.get<Farm>(`${this.farmUri}/${farmID}`);
      return data;
    } catch (e: any) {
      throw new Error(`Failed to get farm: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async updateFarm(farmID: number, twinID: number, name: string): Promise<any> {
    if (!name || name.length <= MIN_FARM_NAME_LENGTH || name.length >= MAX_FARM_NAME_LENGTH) {
      throw new Error(
        `Farm name must have minimum ${MIN_FARM_NAME_LENGTH} and maximum ${MAX_FARM_NAME_LENGTH} characters`,
      );
    }
    const headers = createAuthHeader(twinID, this.client.privateKey);
    try {
      const data = await this.client.patch<any>(`${this.farmUri}/${farmID}`, { farm_name: name }, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to update farm: ${e.response?.status} ${e.response?.statusText}`);
    }
  }
}
