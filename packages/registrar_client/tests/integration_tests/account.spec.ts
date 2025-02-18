import { describe, test, expect } from "@jest/globals";
import tweetnacl from "tweetnacl";
import base64 from "base64-js";
import { RegistrarClient } from "../../src/client/client";
import { UpdateAccountRequest } from "../../src/modules/account/types";

describe("test account module", () => {
  const keyPair = tweetnacl.sign.keyPair();
  const publicKey = base64.fromByteArray(keyPair.publicKey);
  const privateKey = base64.fromByteArray(keyPair.secretKey);

  const client = new RegistrarClient({ baseURL: "http://registrar:8080/v1", privateKey: privateKey });

  let twinID = 1;
  test("create account", async () => {
    const account = await client.accounts.createAccount({});
    expect(account).not.toBeNull();
    if (account) {
      twinID = account.twin_id;
    }
  });

  test("get account by public key", async () => {
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
