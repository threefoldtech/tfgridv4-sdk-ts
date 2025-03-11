import { RegistrarClient } from "../client/client";
import { Farm, FarmCreationResponse, FarmsFilter, FarmUpdateRequest } from "../types/farm";
import { createAuthHeader } from "../utils";
import {Keypair} from "@stellar/stellar-base";

const MAX_FARM_NAME_LENGTH = 40;
const MIN_FARM_NAME_LENGTH = 1;


export class Farms {
  private client: RegistrarClient;
  private readonly farmUri = "/farms";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

   _isStellarAddressValid(stellarAddress: string): boolean {
    try {
      Keypair.fromPublicKey(stellarAddress);
      return true;
    } catch {
      return false;
    }
  }
  _isAlphanumeric(str: string): boolean {
    const validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for (let i = 0; i < str.length; i++) {
      if (!validChars.includes(str[i])) {
        return false;
      }
    }
    return true;
  }

  async createFarm(farmName: string, dedicated: boolean, twinID: number, stellarAddress: string): Promise<FarmCreationResponse> {
    if (twinID <= 0) {
      throw new Error("Invalid twinId");
    }
    if (!farmName || farmName.length <= MIN_FARM_NAME_LENGTH || farmName.length >= MAX_FARM_NAME_LENGTH) {
      throw new Error(
        `Farm name must have minimum ${MIN_FARM_NAME_LENGTH} and maximum ${MAX_FARM_NAME_LENGTH} characters`,
      );
    }

    if (!this._isAlphanumeric(farmName)) {
      throw new Error("Farm name must be alphanumeric");
    }
    
    if (!this._isStellarAddressValid(stellarAddress)) {
      throw new Error("Invalid stellar address");
    }
    
    const farm = { farm_name: farmName, dedicated, twin_id: twinID, stellar_address: stellarAddress };
    const headers = createAuthHeader(twinID, this.client.privateKey);
    try {
      const data = await this.client.post<FarmCreationResponse>(`${this.farmUri}/`, farm, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to create farm: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async listFarms(filter: FarmsFilter): Promise<Farm[]> {
    try {
      const data = await this.client.get<Farm[]>(`${this.farmUri}/`, { params: filter });
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

  async updateFarm(farmID: number, twinID: number, name: string, stellarAddress?: string): Promise<any> {
    if (!name || name.length <= MIN_FARM_NAME_LENGTH || name.length >= MAX_FARM_NAME_LENGTH) {
      throw new Error(
        `Farm name must have minimum ${MIN_FARM_NAME_LENGTH} and maximum ${MAX_FARM_NAME_LENGTH} characters`,
      );
    }

    if (!this._isAlphanumeric(name)) {
      throw new Error("Farm name must be alphanumeric");
    }

    if (stellarAddress && !this._isStellarAddressValid(stellarAddress)) {
      throw new Error("Invalid stellar address");
    }

    const headers = createAuthHeader(twinID, this.client.privateKey);
    const farm : FarmUpdateRequest = { farm_name: name, stellar_address: stellarAddress };
    try {
      const data = await this.client.patch<any>(`${this.farmUri}/${farmID}`,farm , { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to update farm: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

 
}
