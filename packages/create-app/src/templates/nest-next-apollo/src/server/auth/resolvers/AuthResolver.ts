import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';

import { type User } from '@/prisma/client';
import UserType from '@/server/users/dto/types/UserType';
import UsersService from '@/server/users/UsersService';

import CurrentUser from '../decorators/CurrentUser';
import JwtAccess from '../decorators/JwtAccess';
import LoginArgs from '../dto/args/LoginArgs';
import RefreshTokenArgs from '../dto/args/RefreshTokenArgs';
import RegisterArgs from '../dto/args/RegisterArgs';
import AuthType from '../dto/types/AuthType';

@Resolver(AuthType)
export default class AuthResolver {
  constructor(private readonly jwtService: JwtService, private readonly usersService: UsersService) {}

  @JwtAccess()
  @Query(() => UserType)
  async currentUser(@CurrentUser() user: User): Promise<UserType> {
    return user;
  }

  @Mutation(() => AuthType)
  async login(@Args() { input: { email, password } }: LoginArgs): Promise<AuthType> {
    const user = await this.usersService.findUserByCredentials(email, password);

    return this.updateAuthTokens(user);
  }

  @Mutation(() => AuthType)
  async register(@Args() { input }: RegisterArgs): Promise<AuthType> {
    const user = await this.usersService.createUser(input);

    return this.updateAuthTokens(user);
  }

  @Mutation(() => AuthType)
  async refreshToken(@Args() { input: { refreshToken } }: RefreshTokenArgs): Promise<AuthType> {
    let id: number;
    try {
      ({ id } = this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      }));
    } catch (err) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.findUserById(id);

    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const match = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!match) throw new UnauthorizedException();

    return this.updateAuthTokens(user);
  }

  private async updateAuthTokens(user: User) {
    const payload = {
      id: user.id,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.ACCESS_TOKEN_SECRET,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_TOKEN_SECRET,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    });

    await this.usersService.updateUser(user.id, {
      accessToken: bcrypt.hashSync(accessToken, 10),
      refreshToken: bcrypt.hashSync(refreshToken, 10),
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
