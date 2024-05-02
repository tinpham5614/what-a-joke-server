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
import { JokesService } from '../service/jokes.service';
import { Joke } from '../schema/joke.schema';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { RoleGuard } from '../../auth/guard/role.guard';
import { CreateJokeDto } from '../dto/create-joke.dto';
import { GetUser } from '../../auth/decorator/user.decorator';
import { UpdateJokeDto } from '../dto/update-joke.dto';
import { Roles } from '../../auth/decorator/roles.decorator';
import { Role, User } from '../../users/schema/user.schema';

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

  // get jokes by user id
  @Get('user/:userId')
  async getJokesByUserId(@Param('userId') userId: string) {
    return await this.jokesService.getJokesByUserId(userId);
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
  async updateJoke(@Param('id') id: string, @Body() updateJoke: UpdateJokeDto, @GetUser() user: User) {
    return await this.jokesService.updateJoke(
      id,
      updateJoke as Joke,
      user.id as User,
    );
  }

  // delete a joke by id
  @Delete('delete/:id')
  async deleteJokeById(@Param('id') id: string, @GetUser() user: User) {
    return await this.jokesService.deleteJokeById(id, user.id as User);
  }
}
