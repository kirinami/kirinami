import { PartialType } from '@nestjs/swagger';

import { CreateTranslationInput } from './create-translation.input';

export class UpdateTranslationInput extends PartialType(CreateTranslationInput) {}
