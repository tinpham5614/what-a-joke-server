import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { JokesController } from './controller/jokes.controller';
import { JokesService } from './service/jokes/jokes.service';
import { JokeSchema } from './schema/joke.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Joke', schema: JokeSchema }]),
  ],
  controllers: [JokesController],
  providers: [JokesService],
})
export class JokesModule {}
