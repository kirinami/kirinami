import { InputType, PickType } from '@nestjs/graphql';

import { CreateUserInput } from '@/api/users/inputs/create-user.input';

@InputType()
export class LoginInput extends PickType(CreateUserInput, ['email', 'password']) {
}
