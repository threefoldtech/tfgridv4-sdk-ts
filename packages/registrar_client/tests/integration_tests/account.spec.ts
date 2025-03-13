import { describe, test, expect } from "@jest/globals";
import { RegistrarClient } from "../../src/client/client";
import { UpdateAccountRequest } from "../../src/types/account";
import {generateMnemonic} from "bip39";

import config from "../config.json";
import { derivePublicKey, generateRandomSeed } from "../utils";
describe("test account module", () => {
  const mnemonic = generateMnemonic();

  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: mnemonic });

  let twinID = 1;
  test("create account with mnemonic", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    if (account) {
      twinID = account.twin_id;
    }
  });

  test("create account with seed", async () => {
    const seed = generateRandomSeed();
    const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: seed });
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
  });


  test.skip("create account with same private key", async () => {
    await expect(client.accounts.createAccount({})).rejects.toThrowError("Failed to create account: 409 Conflict");
  });

  test("get account by public key", async () => {
    const publicKey = await derivePublicKey(mnemonic);
    const account = await client.accounts.getAccountByPublicKey(publicKey);
    expect(account).not.toBeNull();
  });

  test("get account by twin id", async () => {
    const account = await client.accounts.getAccountByTwinId(twinID);
    expect(account).not.toBeNull();
  });

  test("update account", async () => {
    const update: UpdateAccountRequest = {
      relays: ["relay1", "relay2"],
      rmb_enc_key: "rmb_enc_key",
    };
    const account = await client.accounts.updateAccount(twinID, update);
    expect(account).not.toBeNull();
  });
});
