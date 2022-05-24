import { Injectable } from '@nestjs/common';

import { Token } from './token.entity';
import { TokenRepository } from './token.repository';

@Injectable()
export class TokensService {
  constructor(private readonly tokenRepository: TokenRepository) {
  }

  async set(key: string, value: string, ttl?: number): Promise<Token>;
  async set(userId: number, key: string, value: string, ttl?: number): Promise<Token>;
  async set(keyOrUserId: string | number, valueOrKey?: string, ttlOrValue?: string | number, ttl?: number): Promise<Token> {
    const userId = typeof keyOrUserId === 'number' ? keyOrUserId : undefined;
    const key = typeof keyOrUserId === 'string' ? keyOrUserId : valueOrKey as string;
    const value = typeof keyOrUserId === 'string' ? valueOrKey : ttlOrValue as string;

    const token = await this.tokenRepository.findOne({
      where: {
        userId,
        key,
      },
    });

    if (token) {
      return this.tokenRepository.save(this.tokenRepository.merge(token, {
        value,
        ttl,
      }));
    }

    return this.tokenRepository.save(this.tokenRepository.create({
      userId,
      key,
      value,
      ttl,
    }));
  }

  async get(key: string): Promise<Token | undefined>;
  async get(userId: number, key: string): Promise<Token | undefined>;
  async get(keyOrUserId: string | number, orKey?: string): Promise<Token | undefined> {
    const userId = typeof keyOrUserId === 'number' ? keyOrUserId : undefined;
    const key = typeof keyOrUserId === 'string' ? keyOrUserId : orKey as string;

    return this.tokenRepository.findOne({
      where: {
        userId,
        key,
      },
    });
  }
}
