import * as base64 from "base64-js";
import { AxiosRequestConfig } from "axios";
import { Buffer } from "buffer";
import { Keyring } from "@polkadot/keyring";
import { KeypairType } from "@polkadot/util-crypto/types";
import { KeyringPair } from "@polkadot/keyring/types";
import { validateMnemonic } from "bip39";
import { cryptoWaitReady } from "@polkadot/util-crypto";

export const SUPPORTED_KEYPAIR_TYPES: KeypairType[] = ["sr25519", "ed25519"];



function createSignatureForChallenge(challenge: string, keypair: KeyringPair): string {
  const signature = keypair.sign(Buffer.from(challenge));
  return base64.fromByteArray(signature);
}

export async function deriveKeyPair(
  mnemonicOrSeed: string,
  keypairType: KeypairType
): Promise<KeyringPair> {
  if (!SUPPORTED_KEYPAIR_TYPES.includes(keypairType)) {
    throw new Error(`Unsupported keypair type: ${keypairType}`);
  }

  if (!validateMnemonic(mnemonicOrSeed) && !mnemonicOrSeed.startsWith("0x")) {
    throw new Error("Invalid seed or mnemonic");
  }
  await cryptoWaitReady();
  const keyring = new Keyring({ type: keypairType });
  const keypair = keyring.addFromUri(mnemonicOrSeed);
  return keypair;
}

export async function createSignatureWithPublicKey(
  mnemonicOrSeed: string,
  keypairType: KeypairType ,
): Promise<{ signature: string; publicKey: string; timestamp: number }> {
  const keypair = await deriveKeyPair(mnemonicOrSeed, keypairType);
  const publicKey = base64.fromByteArray(keypair.publicKey);
  const timestamp = Math.floor(Date.now() / 1000);
  const challenge = `${timestamp}:${publicKey}`;
  const signature = createSignatureForChallenge(challenge, keypair);
  return { signature, publicKey, timestamp };
}

export async function createAuthHeader(twinID: number, mnemonicOrSeed: string, keypairType: KeypairType): Promise<AxiosRequestConfig["headers"]> {
  const keypair = await deriveKeyPair(mnemonicOrSeed, keypairType);
  const timestamp = Math.floor(Date.now() / 1000);
  const challenge = `${timestamp}:${twinID}`;
  const signature = createSignatureForChallenge(challenge, keypair);
  const header = {
    "X-Auth": `${Buffer.from(challenge).toString("base64")}:${signature}`,
  };
  return header;
}
