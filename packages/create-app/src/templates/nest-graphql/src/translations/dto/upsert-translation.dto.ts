import { IsNumber, IsOptional } from 'class-validator';

import { CreateTranslationDto } from './create-translation.dto';

export class UpsertTranslationDto extends CreateTranslationDto {
  @IsOptional()
  @IsNumber()
  id?: number;
}
