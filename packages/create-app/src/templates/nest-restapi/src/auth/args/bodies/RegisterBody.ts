import { PickType } from '@nestjs/swagger';

import CreateUserBody from '@/users/args/bodies/CreateUserBody';

export default class RegisterBody extends PickType(CreateUserBody, ['email', 'password']) {}
