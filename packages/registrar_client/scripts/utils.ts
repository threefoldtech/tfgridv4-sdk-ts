import { validateMnemonic, mnemonicToSeed } from "bip39";
import { sign } from "tweetnacl";

export async function derivePublicKey(mnemonicOrSeed: string): Promise<Uint8Array> {
  let seed: Buffer;
  if (validateMnemonic(mnemonicOrSeed)) {
    seed = (await mnemonicToSeed(mnemonicOrSeed)).subarray(0, 32);
  } else if (mnemonicOrSeed.startsWith("0x")) {
    seed = Buffer.from(mnemonicOrSeed.slice(2), "hex");
  } else {
    throw new Error("Invalid seed or mnemonic");
  }
  const keyPair = sign.keyPair.fromSeed(seed);
  return keyPair.publicKey
}
