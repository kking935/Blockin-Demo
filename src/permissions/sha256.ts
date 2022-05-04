import crypto from 'crypto';

export function sha256(metadataPlainText: string) {
    const hash = crypto.createHash('sha256');
    hash.update(metadataPlainText);
    const hashBuffer = hash.digest();
    const metadataHash = new Uint8Array(hashBuffer);
    return metadataHash;
}