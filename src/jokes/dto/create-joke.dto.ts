import {
  IsBoolean,
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from 'src/users/schema/user.schema';

export class CreateJokeDto {
  @IsEmpty()
  readonly createdBy: User;

  @IsString()
  @IsNotEmpty()
  readonly joke: string;

  @IsNumber()
  readonly favoriteCount: number;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  readonly updatedAt: Date;

  @IsBoolean()
  readonly isDeleted: boolean;
}
