import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { Role } from '../schema/user.schema';
import { RoleGuard } from 'src/auth/guard/role.guard';
import { Roles } from 'src/auth/decorator/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // get user by id
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('find/:id')
  async findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  // update user by id
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Patch('update/:id')
  async updateUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }
}
