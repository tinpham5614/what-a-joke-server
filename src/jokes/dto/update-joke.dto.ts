import { IsBoolean, IsEmpty, IsNumber, IsOptional } from 'class-validator';
import { User } from '../../users/schema/user.schema';

export class UpdateJokeDto {
  @IsOptional()
  @IsEmpty({ message: 'ID field is not required' })
  readonly createdByUser: User;

  @IsOptional()
  @IsEmpty({ message: 'ID field is not required' })
  readonly updatedByUser: User;

  @IsOptional()
  readonly joke: string;

  @IsOptional()
  @IsNumber()
  readonly favoriteCount: number;

  @IsOptional()
  @IsBoolean()
  readonly isDeleted: boolean;
}
