import { Account, AccountModel, AccountOptions } from "../types/types";
import Client from "../client/client";
import * as tweetnacl from "tweetnacl";
import * as base64 from "base64-js";
class Accounts {
  protected readonly path = "/accounts";

  async createAccount(account: Partial<AccountModel>): Promise<any | null> {
    account.timestamp = Math.floor(Date.now() / 1000);
    const keyPair = tweetnacl.sign.keyPair();
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.secretKey;

    account.signature = this.createSignature(
      account.timestamp,
      publicKey,
      privateKey
    );

    account.public_key = base64.fromByteArray(publicKey);

    try {
      const data: any = await Client.post<any>(this.path, account);
      return data;
    } catch (error) {
      console.error("Error creating account:", error);
      return null;
    }
  }
  async getAccount(options: AccountOptions): Promise<Account | null> {
    try {
      const data: Account = await Client.get<Account>(this.path, {
        params: { twin_id: options.twin_id, public_key: options.public_key },
      });
      return data;
    } catch (error) {
      console.error(`Error fetching account:`, error);
      return null;
    }
  }
  private createSignature(
    timestamp: number,
    publicKey: Uint8Array,
    privateKey: Uint8Array
  ): string {
    const challenge = `${timestamp}:${base64.fromByteArray(publicKey)}`;
    const signature = tweetnacl.sign.detached(
      Buffer.from(challenge, "utf-8"),
      privateKey
    );

    return base64.fromByteArray(signature);
  }
}

export default Accounts;
