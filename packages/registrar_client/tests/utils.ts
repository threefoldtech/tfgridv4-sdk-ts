import {randomBytes, sign} from 'tweetnacl';
import { validateMnemonic, mnemonicToSeed } from 'bip39';


export async function derivePublicKey(mnemonicOrSeed: string) : Promise<string> {
    let seed: Buffer;
    if (validateMnemonic(mnemonicOrSeed)) {
        seed = (await mnemonicToSeed(mnemonicOrSeed)).subarray(0, 32);
    } else if (mnemonicOrSeed.startsWith('0x')) {
        seed = Buffer.from(mnemonicOrSeed.slice(2), 'hex');
    }
    else {
        throw new Error('Invalid seed or mnemonic');
    }
    const keyPair = sign.keyPair.fromSeed(seed);
    return Buffer.from(keyPair.publicKey).toString('base64');
}

export function generateRandomSeed(): string {
    return Buffer.from(randomBytes(32)).toString('hex');
}