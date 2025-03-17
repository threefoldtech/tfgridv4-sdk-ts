import tweetnacl from 'tweetnacl';
import base64 from 'base64-js';

export function generateKeypair() {
    const keyPair = tweetnacl.sign.keyPair();
    const publicKey = base64.fromByteArray(keyPair.publicKey);
    const privateKey = base64.fromByteArray(keyPair.secretKey);
    return { publicKey, privateKey };
    
}