import {
  IsEmpty,
  IsString,
  IsNotEmpty,
  IsDate,
  IsNumber,
} from 'class-validator';
import { User } from 'src/users/schema/user.schema';

export class UpdateJokeDto {
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
