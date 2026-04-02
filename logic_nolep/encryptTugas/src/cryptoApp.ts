import * as crypto from 'node:crypto';
import 'dotenv/config'

const ALGORITHM: string = 'aes-256-cbc';
const ENCODING: BufferEncoding = 'hex';
const IV_LENGTH: number = 16;
const KEY = crypto.createHash('sha256').update(String(process.env.ENCRYPTION_KEY)).digest();

export const encrypt = (data: string) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(KEY), iv);
    return Buffer.concat([cipher.update(data), cipher.final(), iv]).toString(ENCODING);
}

export const decrypt = (data: string) => {
    const binaryData = Buffer.from(data, ENCODING);
    const iv = binaryData.slice(-IV_LENGTH);
    const encryptedData = binaryData.slice(0, binaryData.length - IV_LENGTH);
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(KEY), iv);
    return Buffer.concat([decipher.update(encryptedData), decipher.final()]).toString();
}