import { log } from "console";
import { Farm, FarmsFilters } from "../types/types";
import Client from "../client/client";

class Farms {
  protected readonly path = "/farms";

  async listFarms(farm: Partial<FarmsFilters> = {}): Promise<Farm[]> {
    try {
      const data: Farm[] = await Client.get<Farm[]>(this.path, {
        params: farm,
      });
      return data;
    } catch (error) {
      log("Error fetching farms:", error);
      return [];
    }
  }
  async getFarm(farmId: number): Promise<Farm | null> {
    try {
      const data: Farm = await Client.get<Farm>(this.path, {
        params: { farm_id: farmId },
      });
      return data;
    } catch (error) {
      console.error(`Error fetching farm with farmID ${farmId}:`, error);
      return null;
    }
  }
}

export default Farms;
