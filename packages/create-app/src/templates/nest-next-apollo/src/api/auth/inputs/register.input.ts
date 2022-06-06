import { InputType, PickType } from '@nestjs/graphql';

import { CreateUserInput } from '@/api/users/inputs/create-user.input';

@InputType()
export class RegisterInput extends PickType(CreateUserInput, ['firstName', 'lastName', 'email', 'password']) {
}
