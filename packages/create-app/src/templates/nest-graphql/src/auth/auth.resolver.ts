import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@prisma/client';

import { UserModel } from '@/users/models/user.model';

import { CurrentUser } from './decorators/current-user';
import { JwtAccess } from './decorators/jwt-access';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RegisterInput } from './dto/register.input';
import { AuthModel } from './models/auth.model';
import { AuthService } from './auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @JwtAccess()
  @Query(() => UserModel)
  async getCurrentUser(@CurrentUser() user: User): Promise<UserModel> {
    return user;
  }

  @Mutation(() => AuthModel)
  async login(@Args('body', { type: () => LoginInput }) body: LoginInput): Promise<AuthModel> {
    const user = await this.authService.loginByCredentials(body);

    return this.authService.login(user);
  }

  @Mutation(() => AuthModel)
  async register(@Args('body', { type: () => RegisterInput }) body: RegisterInput): Promise<AuthModel> {
    const user = await this.authService.registerByCredentials(body);

    return this.authService.login(user);
  }

  @Mutation(() => AuthModel)
  async refreshToken(@Args('body', { type: () => RefreshTokenInput }) body: RefreshTokenInput): Promise<AuthModel> {
    const user = await this.authService.refreshTokenByCredentials(body);

    return this.authService.login(user);
  }
}
