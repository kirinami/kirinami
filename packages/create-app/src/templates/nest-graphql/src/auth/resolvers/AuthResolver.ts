import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

import { type User } from '@/prisma/client';
import UserType from '@/users/dto/types/UserType';

import CurrentUser from '../decorators/CurrentUser';
import JwtAccess from '../decorators/JwtAccess';
import LoginArgs from '../dto/args/LoginArgs';
import RefreshTokenArgs from '../dto/args/RefreshTokenArgs';
import RegisterArgs from '../dto/args/RegisterArgs';
import AuthType from '../dto/types/AuthType';
import AuthService from '../services/AuthService';

@Resolver(AuthType)
export default class AuthResolver {
  constructor(private readonly jwtService: JwtService, private readonly authService: AuthService) {}

  @JwtAccess()
  @Query(() => UserType)
  async currentUser(@CurrentUser() user: User): Promise<UserType> {
    return user;
  }

  @Mutation(() => AuthType)
  async login(@Args() { input }: LoginArgs): Promise<AuthType> {
    const user = await this.authService.loginByCredentials(input);

    return this.authService.generateNewTokensAndSaveTo(user);
  }

  @Mutation(() => AuthType)
  async register(@Args() { input }: RegisterArgs): Promise<AuthType> {
    const user = await this.authService.registerByCredentials(input);

    return this.authService.generateNewTokensAndSaveTo(user);
  }

  @Mutation(() => AuthType)
  async refreshToken(@Args() { input }: RefreshTokenArgs): Promise<AuthType> {
    const user = await this.authService.refreshTokenByCredentials(input);

    return this.authService.generateNewTokensAndSaveTo(user);
  }
}
