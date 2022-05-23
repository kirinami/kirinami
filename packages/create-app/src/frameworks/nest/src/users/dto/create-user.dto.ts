import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email!: string;

  @Length(8, 32)
  password!: string;

  @Length(2, 32)
  firstName!: string;

  @Length(2, 32)
  lastName!: string;
}
