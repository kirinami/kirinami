import { PartialType } from '@nestjs/swagger';

import CreateUserBody from './CreateUserBody';

export default class UpdateUserBody extends PartialType(CreateUserBody) {}
