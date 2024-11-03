import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { CommonModule } from '@/common/common.module';
import { UsersModule } from '@/users/users.module';

import { TokenResolver } from './resolvers/token.resolver';
import { AuthService } from './services/auth.service';
import { AuthResolver } from './auth.resolver';

@Global()
@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    CommonModule,
    UsersModule,
  ],
  providers: [TokenResolver, AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
