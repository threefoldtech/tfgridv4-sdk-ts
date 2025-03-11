import * as base64 from "base64-js";
import * as tweetnacl from "tweetnacl";
import { AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";

function createSignatureForChallenge(challenge: string, privateKey: string): string {
  const signature = tweetnacl.sign.detached(Buffer.from(challenge, "utf-8"), base64.toByteArray(privateKey));
  return base64.fromByteArray(signature);
}

export function createSignatureWithPublicKey(publicKey: string, privateKey: string): { signature: string; timestamp: number } {
  if (publicKey === "") {
    throw new Error("Public key is required");
  }
  const timestamp = Math.floor(Date.now() / 1000);
  const challenge = `${timestamp}:${publicKey}`;
  const signature = createSignatureForChallenge(challenge, privateKey);
  return { signature, timestamp };
}

export function createAuthHeader(twinID: number, privateKey: string): AxiosRequestConfig["headers"] {
  const timestamp = Math.floor(Date.now() / 1000);
  const challenge = `${timestamp}:${twinID}`;
  const signature = createSignatureForChallenge(challenge, privateKey);
  const header = {
    "X-Auth": `${Buffer.from(challenge).toString("base64")}:${signature}`,
  };
  return header;
}
