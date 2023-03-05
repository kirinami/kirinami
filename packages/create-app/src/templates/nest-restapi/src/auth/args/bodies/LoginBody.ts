import { PickType } from '@nestjs/swagger';

import CreateUserBody from '@/users/args/bodies/CreateUserBody';

export default class LoginBody extends PickType(CreateUserBody, ['email', 'password']) {}
