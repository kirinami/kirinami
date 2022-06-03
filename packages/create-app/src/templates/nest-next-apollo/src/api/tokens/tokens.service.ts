import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Token } from './token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token) private readonly tokensRepository: Repository<Token>,
  ) {
  }

  async set(key: string, value: string, ttl?: number): Promise<Token>;
  async set(userId: number, key: string, value: string, ttl?: number): Promise<Token>;
  async set(keyOrUserId: string | number, valueOrKey?: string, ttlOrValue?: string | number, ttl?: number): Promise<Token> {
    const userId = typeof keyOrUserId === 'number' ? keyOrUserId : undefined;
    const key = typeof keyOrUserId === 'string' ? keyOrUserId : valueOrKey as string;
    const value = typeof keyOrUserId === 'string' ? valueOrKey : ttlOrValue as string;

    const token = await this.tokensRepository.findOne({
      where: {
        userId,
        key,
      },
    });

    if (token) {
      return this.tokensRepository.save(this.tokensRepository.merge(token, {
        value,
        ttl,
      }));
    }

    return this.tokensRepository.save(this.tokensRepository.create({
      userId,
      key,
      value,
      ttl,
    }));
  }

  async get(key: string): Promise<Token | null>;
  async get(userId: number, key: string): Promise<Token | null>;
  async get(keyOrUserId: string | number, orKey?: string): Promise<Token | null> {
    const userId = typeof keyOrUserId === 'number' ? keyOrUserId : undefined;
    const key = typeof keyOrUserId === 'string' ? keyOrUserId : orKey as string;

    return this.tokensRepository.findOne({
      where: {
        userId,
        key,
      },
    });
  }
}
