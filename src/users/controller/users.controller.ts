import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { JwtAuthGuard } from '../../auth/guard/jwt.guard';
import { Role, User } from '../schema/user.schema';
import { RoleGuard } from '../../auth/guard/role.guard';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UpdateUserDto } from '../dto/update-user.dto';

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
  async updateUserById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserById(id, updateUserDto as User);
  }
}
