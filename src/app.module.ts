import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGODB_URI), UsersModule, AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
