import {randomBytes} from 'tweetnacl';


export function generateRandomSeed(): string {
    return Buffer.from(randomBytes(32)).toString('hex');
}