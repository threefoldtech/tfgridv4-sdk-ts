import { RegistrarClient } from "../client/client";
import { Account, CreateAccountRequest, UpdateAccountRequest } from "../types/account";
import { createSignatureWithPublicKey, createAuthHeader } from "../utils";

export class Accounts {
  private client: RegistrarClient;

  private readonly accountUri = "/accounts";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async createAccount(request: Partial<CreateAccountRequest>): Promise<Account | null> {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(this.client.mnemonicOrSeed, this.client.keypairType);

    request.public_key = publicKey;
    request.signature = signature;
    request.timestamp = timestamp;
    try {
      const data = await this.client.post<Account>(`${this.accountUri}/`, request);
      return data;
    } catch (e: any) {
      throw new Error(`Failed to create account: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async getAccountByPublicKey(publicKey: string): Promise<Account> {
    try {
      const data = await this.client.get<Account>(`${this.accountUri}/`, {
        params: {
          public_key: publicKey,
        },
      });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to get account by public key: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async getAccountByTwinId(twinId: number): Promise<Account> {
    try {
      const data = await this.client.get<Account>(`${this.accountUri}/`, {
        params: {
          twin_id: twinId,
        },
      });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to get account by twin ID: ${e.response?.status} ${e.response?.statusText}`);
    }
  }

  async updateAccount(twinID: number, body: UpdateAccountRequest): Promise<any> {
    try {
      const headers = await createAuthHeader(twinID, this.client.mnemonicOrSeed, this.client.keypairType);

      const data = await this.client.patch<any>(`${this.accountUri}/${twinID}`, body, { headers });
      return data;
    } catch (e: any) {
      throw new Error(`Failed to update account: ${e.response?.status} ${e.response?.statusText}`);
    }
  }
}
