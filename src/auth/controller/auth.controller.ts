import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LoginDto } from '../dto/login.dto';
import { SignUpDto } from '../dto/signup.dto';
import { ChangePasswordDto } from '../dto/changepassword.dto';
import { GetUser } from '../decorator/user.decorator';
import { User } from 'src/users/schema/user.schema';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { RoleGuard } from '../guard/role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.logIn(loginDto);
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('change-password')
  async ChangePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    return this.authService.changePassword(changePasswordDto, user as User);
  }
}
