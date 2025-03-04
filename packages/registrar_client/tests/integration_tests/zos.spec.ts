import { describe, test, expect } from "@jest/globals";
import { RegistrarClient } from "../../src/client/client";
import { generateKeypair } from "../utils";
import config from "../config.json";

describe("test zos module", () => {
  const { privateKey } = generateKeypair();

  const client = new RegistrarClient({ baseURL: config.baseUrl, privateKey: privateKey });

  test("get zos version", async () => {
    const zos = await client.zos.getZosVersion();
    expect(zos).not.toBeNull();
  });
});
