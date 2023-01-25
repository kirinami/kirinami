import { ArgsType, Field } from '@nestjs/graphql';

import RefreshTokenInput from '../inputs/RefreshTokenInput';

@ArgsType()
export default class RefreshTokenArgs {
  @Field(() => RefreshTokenInput)
  input!: RefreshTokenInput;
}
