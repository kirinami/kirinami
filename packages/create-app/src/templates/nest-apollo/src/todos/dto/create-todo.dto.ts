import { Transform } from 'class-transformer';
import { IsBoolean, Length } from 'class-validator';

export class CreateTodoDto {
  @Length(2, 32)
  title!: string;

  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  completed!: boolean;
}
