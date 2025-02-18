import { RegistrarClient } from "../../client/client";
import { Account, CreateAccountRequest, UpdateAccountRequest } from "./types";
import * as tweetnacl from "tweetnacl";
import * as base64 from "base64-js";
import { createSignatureWithPublicKey, createAuthHeader } from "../../utils";

export class Accounts {
  private client: RegistrarClient;

  private readonly accountUri = "/accounts";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async createAccount(request: Partial<CreateAccountRequest>): Promise<Account | null> {
    const timestamp = Math.floor(Date.now() / 1000);

    const privateKey = this.client.privateKey;
    const keyPair = tweetnacl.sign.keyPair.fromSecretKey(base64.toByteArray(privateKey));

    const publicKey = base64.fromByteArray(keyPair.publicKey);
    const signature = createSignatureWithPublicKey(timestamp, publicKey, privateKey);

    request.public_key = publicKey;
    request.signature = signature;
    request.timestamp = timestamp;

    const data = await this.client.post<Account>(this.accountUri, request);
    return data;
  }

  async getAccountByPublicKey(publicKey: string): Promise<Account> {
    const data = await this.client.get<Account>(this.accountUri, {
      params: {
        public_key: publicKey,
      },
    });
    return data;
  }

  async getAccountByTwinId(twinId: number): Promise<Account> {
    const data = await this.client.get<Account>(this.accountUri, {
      params: {
        twin_id: twinId,
      },
    });

    return data;
  }

  async updateAccount(twinID: number, body: UpdateAccountRequest): Promise<any> {
    const headers = createAuthHeader(twinID, this.client.privateKey);

    const data = await this.client.patch<any>(`${this.accountUri}/${twinID}`, body, { headers });
    return data;
  }
}
