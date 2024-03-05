import {
  IsDate,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { User } from 'src/users/schema/user.schema';

export class CreateJokeDto {
  @IsEmpty()
  createdBy: User;

  @IsString()
  @IsNotEmpty()
  joke: string;

  @IsNumber()
  favoriteCount: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;
}
