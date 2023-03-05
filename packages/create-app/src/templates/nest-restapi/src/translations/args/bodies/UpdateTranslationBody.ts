import { PartialType } from '@nestjs/swagger';

import CreateTranslationBody from './CreateTranslationBody';

export default class UpdateTranslationBody extends PartialType(CreateTranslationBody) {}
