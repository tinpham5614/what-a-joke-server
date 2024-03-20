import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JokesService } from '../service/jokes/jokes.service';
import { Joke } from '../schema/joke.schema';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { CreateJokeDto } from '../dto/create-joke.dto';
import { GetUser } from '../../auth/decorator/user.decorator';
import { UpdateJokeDto } from '../dto/update-joke.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role, User } from 'src/users/schema/user.schema';

@Controller('jokes')
export class JokesController {
  constructor(@Inject(JokesService) private jokesService: JokesService) {}

  // get all jokes sorted by createdAt
  @Get('')
  async getAllJokes(): Promise<Joke[]> {
    return await this.jokesService.getAllJokes();
  }

  // get a joke by id
  @Get('find/:id')
  async getJokeById(@Param('id') id: string) {
    return await this.jokesService.getJokeById(id);
  }

  // create a new joke
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  async createJoke(@Body() newJoke: CreateJokeDto, @GetUser() user: User) {
    return await this.jokesService.createJoke(newJoke as Joke, user.id as User);
  }

  // update a joke by id
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('update/:id')
  async updateJoke(@Param('id') id: string, @Body() jokeDto: UpdateJokeDto, @GetUser() user: User) {
    return await this.jokesService.updateJoke(
      id,
      jokeDto as Joke,
      user.id as User,
    );
  }

  // delete a joke by id
  @Delete('delete/:id')
  async deleteJokeById(@Param('id') id: string, @GetUser() user: User) {
    return await this.jokesService.deleteJokeById(id, user.id as User);
  }
}
