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
    return await this.jokeModel.findById(id);
  }
  // create a new joke
  async createJoke(joke: CreateJokeDto, user: User): Promise<Joke> {
    const newJoke =  Object.assign(joke, { createdByUser: user });
    return await this.jokeModel.create(newJoke);
  }

  // update a joke by id
  async updateJokeById(id: string, joke: Joke, user: User): Promise<Joke> {
    const isValidJokeId = mongoose.isValidObjectId(id);
    if (!isValidJokeId) {
      throw new BadRequestException('Invalid joke id');
    }
    const updatedJoke = await this.jokeModel
      .findByIdAndUpdate(id, joke, {
        new: true,
        runValidatetors: true,
        updatedByUser: user._id,
      })
      .exec();
    if (!updatedJoke || updatedJoke.isDeleted || updatedJoke === null) {
      throw new BadRequestException('Joke {id} not found');
    }
    return updatedJoke;
  }

  // delete a joke by id
  async deleteJokeById(id: string): Promise<Joke> {
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
