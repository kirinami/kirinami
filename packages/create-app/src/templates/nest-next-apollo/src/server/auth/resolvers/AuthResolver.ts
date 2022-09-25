import { Args, Mutation, Resolver } from '@nestjs/graphql';

import AuthService from '../AuthService';
import AuthType from '../dto/AuthType';
import LoginInput from '../dto/LoginInput';
import RegisterInput from '../dto/RegisterInput';

@Resolver(AuthType)
export default class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthType)
  async login(@Args('input', { type: () => LoginInput }) input: LoginInput) {
    return this.authService.login(input);
  }

  @Mutation(() => AuthType)
  async register(@Args('input', { type: () => RegisterInput }) input: RegisterInput) {
    return this.authService.register(input);
  }

  @Mutation(() => AuthType)
  async refresh(@Args('token') token: string) {
    return this.authService.refresh(token);
  }
}
