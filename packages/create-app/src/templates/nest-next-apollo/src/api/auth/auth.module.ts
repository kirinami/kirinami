import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@/api/users/users.module';

import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
  imports: [
    JwtModule.register({}),
    PassportModule,
    UsersModule,
  ],
  providers: [
    JwtAccessStrategy,
    AuthResolver,
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {
}
