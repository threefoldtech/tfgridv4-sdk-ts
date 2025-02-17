import { RegistrarClient } from "../../client/client";
import { Account, CreateAccountRequest, UpdateAccountRequest } from "./types";
import * as tweetnacl from "tweetnacl";
import * as base64 from "base64-js";

export class Accounts {
  private client: RegistrarClient;

  private readonly accountUri = "/accounts";

  constructor(client: RegistrarClient) {
    this.client = client;
  }

  async createAccount(request: Partial<CreateAccountRequest>): Promise<Account | null> {
    const timestamp = Math.floor(Date.now() / 1000);

    const privateKey = this.client.private_key;
    let publicKey;
    try {
      publicKey = base64.fromByteArray(tweetnacl.sign.keyPair.fromSecretKey(base64.toByteArray(privateKey)).publicKey);
    } catch (e) {
      console.error("Failed to generate public key: ", e);
      return null;
    }

    const challenge = `${timestamp}:${publicKey}`;
    const signature = base64.fromByteArray(
      tweetnacl.sign.detached(Buffer.from(challenge, "utf-8"), base64.toByteArray(privateKey)),
    );

    request.public_key = publicKey;
    request.signature = signature;
    request.timestamp = timestamp;

    try {
      const data = await this.client.post<Account>(this.accountUri, request);
      return data;
    } catch (e) {
      console.error("Failed to create account: ", e);
      return null;
    }
  }

  async getAccountByPublicKey(publicKey: string): Promise<Account | null> {
    try {
      const data = await this.client.get<Account>(this.accountUri, {
        params: {
          public_key: publicKey,
        },
      });
      return data;
    } catch (e) {
      console.error("Failed to get account: ", e);
      return null;
    }
  }

  async getAccountByTwinId(twinId: number): Promise<Account | null> {
    try {
      const data = await this.client.get<Account>(this.accountUri, {
        params: {
          twin_id: twinId,
        },
      });

      return data;
    } catch (e) {
      console.error("Failed to get account: ", e);
      return null;
    }
  }

  async updateAccount(twinID: number, body: UpdateAccountRequest): Promise<any> {
    const timestamp = Math.floor(Date.now() / 1000);
    const challenge = `${timestamp}:${twinID}`;
    const privateKey = this.client.private_key;
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
      const data = await this.client.patch<any>(`${this.accountUri}/${twinID}`, body, config);
      return data;
    } catch (e) {
      console.error("Failed to update account: ", e);
      return null;
    }
  }
}
