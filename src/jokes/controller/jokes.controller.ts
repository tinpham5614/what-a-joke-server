import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JokesService } from '../service/jokes/jokes.service';
import { Joke } from '../schema/joke.schema';
import { User } from 'src/users/schema/user.schema';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { CreateJokeDto } from '../dto/create-joke.dto';

@Controller('jokes')
export class JokesController {
  constructor(private readonly jokesService: JokesService) {}

  // get all jokes sorted by createdAt
  @Get('')
  async getAllJokes(): Promise<Joke[]> {
    return await this.jokesService.getAllJokes();
  }

  // get a joke by id
  @Get(':id')
  async getJokeById(id: string): Promise<Joke> {
    return await this.jokesService.getJokeById(id);
  }

  // create a new joke
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('create')
  async createJoke(@Body() newJoke: CreateJokeDto, @Req() req): Promise<Joke> {
    return await this.jokesService.createJoke(newJoke as Joke, req.user.id as User);
  }

  // update a joke by id
  @Put('update/:id')
  async updateJokeById(@Body() joke: Joke, id: string, @Req() req) {
    return await this.jokesService.updateJokeById(
      id,
      joke,
      req.user.id as User,
    );
  }

  // delete a joke by id
  @Delete('delete/:id')
  async deleteJokeById(id: string): Promise<Joke> {
    return await this.jokesService.deleteJokeById(id);
  }
}
