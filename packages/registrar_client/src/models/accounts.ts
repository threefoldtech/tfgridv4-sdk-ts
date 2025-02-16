import { log } from "console";
import { Account, AccountModel, AccountOptions } from "../types/types";
import Client from "../client/client";
import { encodeBase64, decodeBase64 } from "tweetnacl-util";

class Accounts {
  protected readonly path = "/accounts";
  createSignature(public_key: string, timestamp: number): string {
    const TextEncodetttr = `${timestamp}:${public_key}`;
    const publicKeyUint8 = new TextEncoder().encode(TextEncodetttr);
    const keyBase64 = encodeBase64(publicKeyUint8);
    return keyBase64;

    // const publicKeyUint8 = new TextEncoder().encode(public_key);
    // const keyBase64 = encodeBase64(publicKeyUint8);
    // return `${timestamp}:${keyBase64}`;
  }
  async createAccount(account: Partial<AccountModel>): Promise<any | null> {
    account.timestamp = Math.floor(Date.now() / 1000);
    if (account.public_key)
      account.signature = this.createSignature(
        account.public_key,
        account.timestamp
      );

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
}

export default Accounts;
