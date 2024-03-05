import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JokesController } from './jokes/controller/jokes.controller';

@Module({
  imports: [
    ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URI), UsersModule, AuthModule
  ],
  controllers: [JokesController],
  providers: [],
})
export class AppModule {}
