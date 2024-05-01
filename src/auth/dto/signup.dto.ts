import { IsEmail, IsEmpty, IsNotEmpty } from 'class-validator';
import { Role } from '../../users/schema/user.schema';
export class SignUpDto {
  @IsEmpty()
  readonly firstName: string;

  @IsEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly confirmPassword: string;

  @IsEmpty()
  readonly role: Role;
}
