import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Joke } from 'src/jokes/schema/joke.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { Role, User } from 'src/users/schema/user.schema';
import { CreateJokeDto } from 'src/jokes/dto/create-joke.dto';

@Injectable()
export class JokesService {
  constructor(@InjectModel(Joke.name) private jokeModel: Model<Joke>) {}

  // get all jokes sorted by createdAt
  async getAllJokes(): Promise<Joke[]> {
    const limitPerPage = 10;
    const currentPage = 1;
    const skip = (currentPage - 1) * limitPerPage;
    return await this.jokeModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitPerPage);
  }

  // get a joke by id
  async getJokeById(id: string): Promise<Joke> {
    const isValidJokeId = mongoose.isValidObjectId(id);
    if (!isValidJokeId) {
      throw new BadRequestException('Invalid joke id');
    }
    return await this.jokeModel.findById(id);
  }
  // create a new joke
  async createJoke(
    joke: CreateJokeDto,
    user: User,
  ): Promise<{ newJoke: Joke; message: string }> {
    const newJoke = Object.assign(joke, { createdByUser: user });
    const createdJoke = new this.jokeModel(newJoke);
    await createdJoke.save();
    return {
      newJoke: createdJoke,
      message: 'Joke created successfully',
    };
  }

  // update a joke by id
  async updateJoke(
    id: string,
    joke: Joke,
    user: User,
  ): Promise<{ updatedJoke: Joke; message: string }> {
    const isValidJokeId = mongoose.isValidObjectId(id);
    if (!isValidJokeId) {
      throw new BadRequestException('Invalid joke id');
    }

    if (user.role !== Role.ADMIN && joke.createdByUser.toString() !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to update this joke',
      );
    }

    const updatedJoke = await this.jokeModel
      .findByIdAndUpdate(
        id,
        {
          ...joke,
          updatedByUser: user,
        },
        {
          new: true,
        },
      )
      .exec();
    if (!updatedJoke || updatedJoke === null) {
      throw new BadRequestException('Joke {id} not found');
    }
    return {
      updatedJoke,
      message: 'Joke updated successfully',
    };
  }

  // delete a joke by id
  async deleteJokeById(id: string, user: User): Promise<Joke> {
    const isValidJokeId = mongoose.isValidObjectId(id);
    if (!isValidJokeId) {
      throw new BadRequestException('Invalid joke id');
    }
    // find joke by id and update isDeleted to true
    const deletedJoke = await this.jokeModel
      .findByIdAndUpdate(
        id,
        {
          isDeleted: true,
          updatedByUser: user,
        },
        {
          new: true,
        },
      )
      .exec();
    if (!deletedJoke || deletedJoke === null) {
      throw new BadRequestException('Joke {id} not found');
    }
    return deletedJoke;
  }
}
