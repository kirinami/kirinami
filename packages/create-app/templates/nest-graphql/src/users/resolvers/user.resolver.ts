import { Resolver } from '@nestjs/graphql';

import { UserModel } from '../models/user.model';

@Resolver(() => UserModel)
export class UserResolver {}
