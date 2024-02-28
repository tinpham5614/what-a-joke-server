import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
