import { InputType, PickType } from '@nestjs/graphql';

import CreateUserInput from '@/server/users/dto/CreateUserInput';

@InputType()
export default class RegisterInput extends PickType(CreateUserInput, ['firstName', 'lastName', 'email', 'password']) {}
