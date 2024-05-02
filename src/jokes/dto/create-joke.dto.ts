import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../users/schema/user.schema';

export class CreateJokeDto {
  @IsEmpty({message: 'ID field is not required'})
  readonly createdByUser: User;

  @IsString()
  @IsNotEmpty()
  readonly joke: string;

  @IsOptional()
  @IsNumber()
  readonly favoriteCount: number;

  @IsOptional()
  @IsBoolean()
  readonly isDeleted: boolean;
}
