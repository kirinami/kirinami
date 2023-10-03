import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@prisma/client';

import { UserEntity } from '@/users/entities/user.entity';

import { CurrentUser } from './decorators/current-user';
import { JwtAccess } from './decorators/jwt-access';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RegisterInput } from './dto/register.input';
import { AuthEntity } from './entities/auth.entity';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @JwtAccess()
  @Query(() => UserEntity)
  async getCurrentUser(@CurrentUser() user: User): Promise<UserEntity> {
    return user;
  }

  @Mutation(() => AuthEntity)
  async login(@Args('body', { type: () => LoginInput }) body: LoginInput): Promise<AuthEntity> {
    const user = await this.authService.loginByCredentials(body);

    return this.authService.login(user);
  }

  @Mutation(() => AuthEntity)
  async register(@Args('body', { type: () => RegisterInput }) body: RegisterInput): Promise<AuthEntity> {
    const user = await this.authService.registerByCredentials(body);

    return this.authService.login(user);
  }

  @Mutation(() => AuthEntity)
  async refreshToken(@Args('body', { type: () => RefreshTokenInput }) body: RefreshTokenInput): Promise<AuthEntity> {
    const user = await this.authService.refreshTokenByCredentials(body);

    return this.authService.login(user);
  }
}
