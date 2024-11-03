import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@prisma/client';

import { UserModel } from '@/users/models/user.model';

import { BearerAccess } from './decorators/bearer-access';
import { CurrentUser } from './decorators/current-user';
import { LoginInput } from './dto/login.input';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { RegisterInput } from './dto/register.input';
import { TokenModel } from './models/token.model';
import { AuthService } from './services/auth.service';

@Resolver(() => TokenModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @BearerAccess()
  @Query(() => UserModel)
  currentUser(@CurrentUser() user: User): UserModel {
    return user;
  }

  @Mutation(() => TokenModel)
  async login(@Args('input', { type: () => LoginInput }) input: LoginInput): Promise<TokenModel> {
    const user = await this.authService.loginByCredentials(input);

    return this.authService.login(user);
  }

  @Mutation(() => TokenModel)
  async register(@Args('input', { type: () => RegisterInput }) input: RegisterInput): Promise<TokenModel> {
    const user = await this.authService.registerByCredentials(input);

    return this.authService.login(user);
  }

  @Mutation(() => TokenModel)
  async refreshToken(@Args('input', { type: () => RefreshTokenInput }) input: RefreshTokenInput): Promise<TokenModel> {
    const user = await this.authService.refreshTokenByCredentials(input);

    return this.authService.login(user);
  }
}
