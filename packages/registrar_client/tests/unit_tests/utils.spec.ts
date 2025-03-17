import * as base64 from "base64-js";
import * as tweetnacl from "tweetnacl";
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { createSignatureWithPublicKey, createAuthHeader } from "../../src/utils";
import { generateMnemonic} from "bip39";

jest.mock("tweetnacl", () => ({
  sign: {
    detached: jest.fn(() => new Uint8Array([1, 2, 3, 4])),
    keyPair: {
      fromSeed: jest.fn(() => ({
        publicKey: new Uint8Array([1, 2, 3, 4]),
        secretKey: new Uint8Array([1, 2, 3, 4]),
      })),
    },
  },
}));

describe("Util Functions", () => {
  const mnemonic = generateMnemonic();
  const seed = "0xbd34054dca27b3fa2c84e50251293f58db494450d68f30addcdaca9b7fc6e7ef";
  const twinID = 123456;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createSignatureWithPublicKey generates a valid signature from mnemonics", async () => {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(mnemonic);
    expect(tweetnacl.sign.detached).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
      new Uint8Array([1, 2, 3, 4]),
    );

    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createSignatureWithPublicKey generates a valid signature from seed", async () => {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(seed);
    expect(tweetnacl.sign.detached).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
      new Uint8Array([1, 2, 3, 4]),
    );

    expect(signature).toBe(base64.fromByteArray(new Uint8Array
      ([1, 2, 3, 4])));
  });

  test("createAuthHeader generates correct headers", async () => {
    jest.spyOn(global.Date, "now").mockImplementation(() => 1700000000000);
    const timestamp = 1700000000;

    const headers = await createAuthHeader(twinID, mnemonic);

    expect(headers).toHaveProperty("X-Auth");
    const [encodedChallenge, signature] = headers!["X-Auth"].split(":");

    expect(Buffer.from(encodedChallenge, "base64").toString("utf-8")).toBe(`${timestamp}:${twinID}`);
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createSignatureWithPublicKey handles invalid mnemonic", async () => {
    const invalidMnemonic = "invalid mnemonic";
    await expect(createSignatureWithPublicKey(invalidMnemonic)).rejects.toThrow("Invalid seed or mnemonic");
  });

  test("createAuthHeader handles invalid mnemonic", async () => {
    const invalidMnemonic = "invalid mnemonic";
    await expect(createAuthHeader(twinID, invalidMnemonic)).rejects.toThrow("Invalid seed or mnemonic");
  });
});
