import { Resolver } from '@nestjs/graphql';

import { TokenModel } from '../models/token.model';

@Resolver(() => TokenModel)
export class TokenResolver {}
