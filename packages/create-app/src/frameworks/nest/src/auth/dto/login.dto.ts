import { IsEmail, Length } from 'class-validator';

export class LoginDto {
  @IsEmail({}, {
    message: 'Please enter a valid email',
  })
  email!: string;

  @Length(12, 128, {
    message: 'Please enter a valid password',
  })
  password!: string;
}
