import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { User } from '@/api/users/user.entity';

import { JwtRefresh } from './decorators/jwt-refresh.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LocalStrategy } from './strategies/local.strategy';
import { Auth } from './auth.entity';
import { AuthService } from './auth.service';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(
    private readonly localStrategy: LocalStrategy,
    private readonly authService: AuthService,
  ) {
  }

  @Query(() => Auth, { name: 'login' })
  async login(@Args('email') email: string, @Args('password') password: string) {
    const user = await this.localStrategy.validate(email, password);

    return this.authService.login(user);
  }

  @Mutation(() => Auth, { name: 'register' })
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('firstName') firstName: string,
    @Args('lastName') lastName: string,
  ) {
    return this.authService.register({
      email,
      password,
      firstName,
      lastName,
    });
  }

  @JwtRefresh()
  @Mutation(() => Auth, { name: 'refresh' })
  async refresh(@CurrentUser() user: User) {
    return this.authService.login(user);
  }
}
