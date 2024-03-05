import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Joke } from 'src/jokes/schema/joke.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { User } from 'src/users/schema/user.schema';

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
  async createJoke(joke: Joke, user: User): Promise<Joke> {
    try {
      joke.createdBy = user;
      return await this.jokeModel.create(joke);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // update a joke by id
  async updateJokeById(id: string, joke: Joke): Promise<Joke> {
    const isValidJokeId = mongoose.isValidObjectId(id);
    if (!isValidJokeId) {
      throw new BadRequestException('Invalid joke id');
    }
    return await this.jokeModel.findByIdAndUpdate(id, joke, { new: true });
  }

  // delete a joke by id
  async deleteJokeById(id: string): Promise<Joke> {
    const isValidJokeId = mongoose.isValidObjectId(id);
    if (!isValidJokeId) {
      throw new BadRequestException('Invalid joke id');
    }
    // find joke by id and update isDeleted to true
    return await this.jokeModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
  }
}
