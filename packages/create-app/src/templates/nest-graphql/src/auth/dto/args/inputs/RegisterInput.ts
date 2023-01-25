import { InputType, PickType } from '@nestjs/graphql';

import CreateUserInput from '@/users/dto/args/inputs/CreateUserInput';

@InputType()
export default class RegisterInput extends PickType(CreateUserInput, ['email', 'password']) {}
