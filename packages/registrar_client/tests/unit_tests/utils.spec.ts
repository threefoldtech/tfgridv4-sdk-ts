import * as base64 from "base64-js";
import * as tweetnacl from "tweetnacl";
import { describe, test, expect, jest, beforeEach } from "@jest/globals";
import { createSignatureWithPublicKey, createAuthHeader } from "../../src/utils";

jest.mock("tweetnacl", () => ({
  sign: {
    detached: jest.fn(() => new Uint8Array([1, 2, 3, 4])),
  },
}));

describe("Util Functions", () => {
  const privateKey = base64.fromByteArray(new Uint8Array(32));
  const publicKey = base64.fromByteArray(new Uint8Array(32));
  const twinID = 123456;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("createSignatureWithPublicKey generates a valid signature", () => {
    const timestamp = 1700000000;
    const signature = createSignatureWithPublicKey(timestamp, publicKey, privateKey);

    expect(tweetnacl.sign.detached).toHaveBeenCalledWith(
      Buffer.from(`${timestamp}:${publicKey}`, "utf-8"),
      base64.toByteArray(privateKey),
    );

    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createAuthHeader generates correct headers", () => {
    jest.spyOn(global.Date, "now").mockImplementation(() => 1700000000000);
    const timestamp = 1700000000;

    const headers = createAuthHeader(twinID, privateKey)!;

    expect(headers).toHaveProperty("X-Auth");
    const [encodedChallenge, signature] = headers["X-Auth"].split(":");

    expect(Buffer.from(encodedChallenge, "base64").toString("utf-8")).toBe(`${timestamp}:${twinID}`);
    expect(signature).toBe(base64.fromByteArray(new Uint8Array([1, 2, 3, 4])));
  });

  test("createSignatureWithPublicKey handles invalid base64 privateKey", () => {
    const invalidPrivateKey = "invalid_base64_string";
    expect(() => createSignatureWithPublicKey(1700000000, publicKey, invalidPrivateKey)).toThrow();
  });

  test("createSignatureWithPublicKey handles empty publicKey", () => {
    const emptyPublicKey = "";
    expect(() => createSignatureWithPublicKey(1700000000, emptyPublicKey, privateKey)).toThrow();
  });

  test("createAuthHeader handles invalid base64 privateKey", () => {
    const invalidPrivateKey = "invalid_base64_string";
    expect(() => createAuthHeader(twinID, invalidPrivateKey)).toThrow();
  });
});
