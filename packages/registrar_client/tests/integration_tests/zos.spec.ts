import { describe, test, expect } from "@jest/globals";
import { RegistrarClient } from "../../src/client/client";
import config from "../config.json";
import { generateMnemonic } from "bip39";

describe("test zos module", () => {
  const mnemonic = generateMnemonic(); 
  const client = new RegistrarClient({ baseURL: config.baseUrl, mnemonicOrSeed: mnemonic });

  test("get zos version", async () => {
    const zos = await client.zos.getZosVersion();
    expect(zos).not.toBeNull();
  });
});
