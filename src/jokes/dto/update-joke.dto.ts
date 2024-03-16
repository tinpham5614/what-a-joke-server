import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from 'src/users/schema/user.schema';

export class UpdateJokeDto {
  @IsEmpty({message: 'ID field is not required'})
  readonly createdByUser: User;

  @IsString()
  @IsNotEmpty()
  readonly joke: string;

  @IsNumber()
  readonly favoriteCount: number;

  @IsOptional()
  @IsBoolean()
  readonly isDeleted: boolean;
}
