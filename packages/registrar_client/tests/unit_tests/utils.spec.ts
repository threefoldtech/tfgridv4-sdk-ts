import * as base64 from "base64-js";
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { createSignatureWithPublicKey, createAuthHeader } from "../../src/utils";
import { generateMnemonic } from "bip39";



const mockPublicKeySr = new Uint8Array([1, 2, 3, 4]);
const mockPublicKeyEd = new Uint8Array([5, 6, 7, 8]);
const mockSignatureSr = jest.fn().mockReturnValue(new Uint8Array([1, 2, 3, 4]));
const mockSignatureEd = jest.fn().mockReturnValue(new Uint8Array([5, 6, 7, 8]));

jest.mock("@polkadot/keyring", () => {
  return {
    Keyring: jest.fn().mockImplementation(function (options: any) {
      return {
        addFromUri: jest.fn().mockReturnValue({
          publicKey: options?.type === "sr25519" ? mockPublicKeySr : mockPublicKeyEd,
          sign: options?.type === "sr25519" ? mockSignatureSr : mockSignatureEd,
        }),
      };
    }),
  };
});

describe("Util Functions", () => {
  const mnemonic = generateMnemonic();
  const seed = "0xbd34054dca27b3fa2c84e50251293f58db494450d68f30addcdaca9b7fc6e7ef";
  const twinID = 123456;

  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(global.Date, "now").mockImplementation(() => 1700000000000);
  });

  test("createSignatureWithPublicKey generates a valid signature from mnemonics with sr25519 keypair", async () => {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(mnemonic, "sr25519");
    expect(timestamp).toBe(1700000000);
    expect(publicKey).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));

    expect(mockSignatureSr).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
    );
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createSignatureWithPublicKey generates a valid signature from seed with sr25519", async () => {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(seed, "sr25519");
    expect(timestamp).toBe(1700000000);
    expect(publicKey).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
    expect(mockSignatureSr).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
    );
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createSignatureWithPublicKey generates a valid signature from mnemonics with ed25519 keypair", async () => {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(mnemonic, "ed25519");
    expect(timestamp).toBe(1700000000);
    expect(publicKey).toBe(base64.fromByteArray(new Uint8Array([5, 6, 7, 8])));

    expect(mockSignatureEd).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
    );
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([5, 6, 7, 8])));
  });

  test("createSignatureWithPublicKey generates a valid signature from seed with ed25519", async () => {
    const { signature, publicKey, timestamp } = await createSignatureWithPublicKey(seed,"ed25519");
    expect(timestamp).toBe(1700000000);
    expect(publicKey).toBe(base64.fromByteArray(new Uint8Array([5, 6, 7, 8])));
    expect(mockSignatureEd).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
    );
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([5, 6, 7, 8])));
  });

  test("createAuthHeader generates correct headers with sr25519", async () => {

    const headers = await createAuthHeader(twinID, mnemonic, "sr25519");

    expect(headers).toHaveProperty("X-Auth");
    const [encodedChallenge, signature] = headers!["X-Auth"].split(":");

    expect(encodedChallenge).toBe(base64.fromByteArray(Buffer.from(`${1700000000}:${twinID}`)));
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createAuthHeader generates correct headers with ed25519", async () => {
    const headers = await createAuthHeader(twinID, mnemonic, "ed25519");

    expect(headers).toHaveProperty("X-Auth");
    const [encodedChallenge, signature] = headers!["X-Auth"].split(":");

    expect(encodedChallenge).toBe(base64.fromByteArray(Buffer.from(`${1700000000}:${twinID}`)));
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([5, 6, 7, 8])));
  });

  test("createSignatureWithPublicKey handles invalid mnemonic", async () => {
    const invalidMnemonic = "invalid mnemonic";
    await expect(createSignatureWithPublicKey(invalidMnemonic, "sr25519")).rejects.toThrow("Invalid seed or mnemonic");
  });

  test("createAuthHeader handles invalid mnemonic", async () => {
    const invalidMnemonic = "invalid mnemonic";
    await expect(createAuthHeader(twinID, invalidMnemonic, "sr25519")).rejects.toThrow("Invalid seed or mnemonic");
  });
});
