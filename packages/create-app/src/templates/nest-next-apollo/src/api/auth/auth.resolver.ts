import { UnauthorizedException } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import bcrypt from 'bcryptjs';

import { User } from '@/api/users/user.entity';
import { UsersService } from '@/api/users/users.service';

import { JwtRefresh } from './decorators/jwt-refresh.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginInput } from './inputs/login.input';
import { RegisterInput } from './inputs/register.input';
import { AuthOutput } from './outputs/auth.output';
import { AuthService } from './auth.service';

@Resolver(AuthOutput)
export class AuthResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
  }

  @Mutation(() => AuthOutput)
  async login(@Args('input', { type: () => LoginInput }) input: LoginInput) {
    const user = await this.usersService.findOne({
      where: {
        email: input.email,
      },
    });
    if (!user) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(input.password, user.password);
    if (!isMatch) throw new UnauthorizedException();

    return this.authService.login(user);
  }

  @Mutation(() => AuthOutput)
  async register(@Args('input', { type: () => RegisterInput }) input: RegisterInput) {
    const user = await this.usersService.create({
      input,
    });

    return this.authService.login(user);
  }

  @JwtRefresh()
  @Mutation(() => AuthOutput)
  async refresh(@CurrentUser() currentUser: User) {
    return this.authService.login(currentUser);
  }
}
