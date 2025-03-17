import * as base64 from "base64-js";
import * as tweetnacl from "tweetnacl";
import { AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";
import { mnemonicToSeed, validateMnemonic} from "bip39";

function createSignatureForChallenge(challenge: string, privateKey: string): string {
  const signature = tweetnacl.sign.detached(Buffer.from(challenge, "utf-8"), base64.toByteArray(privateKey));
  return base64.fromByteArray(signature);
}

async function deriveKeyPair(mnemonicOrSeed: string): Promise<{ publicKey: string; privateKey: string; }> {
  let seed : Buffer;
  if (validateMnemonic(mnemonicOrSeed)) {
    seed = (await mnemonicToSeed(mnemonicOrSeed)).subarray(0, 32);

  } else if(mnemonicOrSeed.startsWith("0x")) {
    seed = Buffer.from(mnemonicOrSeed.slice(2), "hex"); 
  } else {
    throw new Error("Invalid seed or mnemonic");
  }
  const keyPair = tweetnacl.sign.keyPair.fromSeed(seed);
  return {
    publicKey: base64.fromByteArray(keyPair.publicKey),
    privateKey: base64.fromByteArray(keyPair.secretKey),
  };
}

export async function createSignatureWithPublicKey(mnemonicOrSeed: string): Promise<{ signature: string; publicKey: string; timestamp: number; }> {
  const { publicKey, privateKey } = await deriveKeyPair(mnemonicOrSeed);
  const timestamp = Math.floor(Date.now() / 1000);
  const challenge = `${timestamp}:${publicKey}`;
  const signature = createSignatureForChallenge(challenge, privateKey);
  return { signature, publicKey, timestamp };
}

export async function createAuthHeader(twinID: number, mnemonicOrSeed: string): Promise<AxiosRequestConfig["headers"]> {
  const { privateKey } = await deriveKeyPair(mnemonicOrSeed);
  const timestamp = Math.floor(Date.now() / 1000);
  const challenge = `${timestamp}:${twinID}`;
  const signature = createSignatureForChallenge(challenge, privateKey);
  const header = {
    "X-Auth": `${Buffer.from(challenge).toString("base64")}:${signature}`,
  };
  return header;
}

