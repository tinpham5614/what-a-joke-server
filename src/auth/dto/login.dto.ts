import { IsEmail, IsEmpty } from 'class-validator';

export class LoginDto {
  @IsEmpty()
  @IsEmail()
  readonly email: string;

  @IsEmpty()
  readonly password: string;
}
