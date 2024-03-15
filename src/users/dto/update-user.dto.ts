import { Role } from '../schema/user.schema';
import { IsEmpty, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto  {
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @IsOptional()
  @IsString()
  readonly lastName: string;

  @IsOptional()
  @IsEmpty({ message: 'Cannot update email here' })
  readonly email: string;

  @IsOptional()
  @IsEmpty({ message: 'Cannot update password here' })
  readonly password: string;

  @IsOptional()
  @IsEnum(Role)
  readonly role: Role;
}
