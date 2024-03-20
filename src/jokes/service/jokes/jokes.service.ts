import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Joke } from 'src/jokes/schema/joke.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';
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
    const joke = await this.jokeModel.findById(id);
    if (!joke || joke === null) {
      throw new BadRequestException(`Joke ${id} not found`);
    }
    return joke;
  }

  // get jokes by user id
  async getJokesByUserId(userId: string): Promise<Joke[]> {
    const isValidUserId = mongoose.isValidObjectId(userId);
    if (!isValidUserId) {
      throw new BadRequestException('Invalid user id');
    }
    const jokes = await this.jokeModel.find({ createdByUser: userId });
    if (!jokes || jokes === null) {
      throw new BadRequestException(
        `Jokes created by user ${userId} not found`,
      );
    }
    return jokes;
  }
  // create a new joke
  async createJoke(
    joke: CreateJokeDto,
    user: User,
  ): Promise<{ newJoke: Joke; message: string }> {
    const newJoke = Object.assign(joke, { createdByUser: user });
    const createdJoke = new this.jokeModel(newJoke);
    await createdJoke.save();
    if (!createdJoke || createdJoke === null) {
      throw new BadRequestException('Joke not created');
    }
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
      throw new BadRequestException(`Joke ${id} not found`);
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
      throw new BadRequestException(`Joke ${id} not found`);
    }
    return deletedJoke;
  }
}
