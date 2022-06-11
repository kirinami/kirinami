import { Args, Mutation, Resolver } from '@nestjs/graphql';

import { LoginArgs } from './args/login.args';
import { RegisterArgs } from './args/register.args';
import { RefreshArgs } from './args/refresh.args';
import { AuthOutput } from './outputs/auth.output';
import { AuthService } from './auth.service';

@Resolver(AuthOutput)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {
  }

  @Mutation(() => AuthOutput)
  async login(@Args() { input }: LoginArgs) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthOutput)
  async register(@Args() { input }: RegisterArgs) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthOutput)
  async refresh(@Args() { token }: RefreshArgs) {
    return this.authService.refresh(token);
  }
}
