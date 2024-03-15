import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get user by id
  @Get('find/:id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  // update user by id
  @Patch('update/:id')
  async updateUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
