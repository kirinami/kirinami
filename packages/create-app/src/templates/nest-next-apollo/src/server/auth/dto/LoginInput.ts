import { InputType, PickType } from '@nestjs/graphql';

import CreateUserInput from '@/server/users/dto/CreateUserInput';

@InputType()
export default class LoginInput extends PickType(CreateUserInput, ['email', 'password']) {}
