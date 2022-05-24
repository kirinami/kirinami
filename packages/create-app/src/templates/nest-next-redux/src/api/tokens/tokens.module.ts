import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TokenRepository } from './token.repository';
import { TokensService } from './tokens.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TokenRepository,
    ]),
  ],
  providers: [TokensService],
  controllers: [],
  exports: [TokensService],
})
export class TokensModule {
}
