import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { JokesService } from '../service/jokes/jokes.service';
import { Joke } from '../schema/joke.schema';
import { User } from 'src/users/schema/user.schema';

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
  @Post('create')
  async createJoke(@Body() joke: Joke, user: User): Promise<Joke> {
    return await this.jokesService.createJoke(joke, user);
  }

  // update a joke by id
  @Put('update/:id')
  async updateJokeById(@Body() joke: Joke, id: string): Promise<Joke> {
    return await this.jokesService.updateJokeById(id, joke);
  }

  // delete a joke by id
  @Delete('delete/:id')
  async deleteJokeById(id: string): Promise<Joke> {
    return await this.jokesService.deleteJokeById(id);
  }
}
