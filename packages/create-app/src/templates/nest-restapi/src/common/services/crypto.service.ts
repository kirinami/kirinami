import crypto from 'node:crypto';

export class CryptoService {
  hash(plain: string) {
    const salt = crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(plain, salt, 1000, 256, 'sha512');

    return `${salt.toString('base64url')}.${hash.toString('base64url')}`;
  }

  compare(plain: string, hashed: string) {
    const [salt, hash] = hashed.split('.');

    return crypto.timingSafeEqual(
      Buffer.from(hash, 'base64url'),
      crypto.pbkdf2Sync(plain, Buffer.from(salt, 'base64url'), 1000, 256, 'sha512'),
    );
  }
}
