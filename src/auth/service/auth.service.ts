import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, User } from '../../users/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/signup.dto';
import { ChangePasswordDto } from '../dto/changepassword.dto';
import { GetUser } from '../decorator/user.decorator';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  // log in user
  async logIn(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // compare password with hashed password
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
    });

    return { token, subRole: user.role, sub: user._id };
  }
  // sign up user
  async signUp(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password, confirmPassword } = signUpDto;
    if (password !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }
    // hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //find if user exists
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new UnauthorizedException('User already exists');
    }

    // create new user
    const newUser = await this.userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: Role.USER,
    });

    // create token
    const token = this.jwtService.sign({
      id: newUser._id,
      email: newUser.email,
    });

    return { token, userRole: newUser.role };
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    @GetUser() user: User,
  ) {
    const { currentPassword, newPassword, confirmNewPassword } =
      changePasswordDto;

    // get user information
    const userEmail = user.email;
    const userPassword = user.password;

    // compare current password with user password
    const isValidPassword = await bcrypt.compare(currentPassword, userPassword);
    if (!isValidPassword) {
      throw new HttpException('Incorrect Password', 400);
    }

    // check if new password and confirm password match
    if (newPassword != confirmNewPassword) {
      throw new HttpException('Password do not match', 400);
    }

    // hash new password
    const saltNumber = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltNumber);

    // compare new password with the current password
    const isSamePassword = await bcrypt.compare(
      currentPassword,
      hashedPassword,
    );
    if (isSamePassword) {
      throw new HttpException(
        'New password cannot be the same as current password',
        400,
      );
    }

    // update user password
    await this.userModel.updateOne(
      {
        email: userEmail,
      },
      {
        password: hashedPassword,
      },
    );
    return { message: 'Password changed successfully' };
  }
}
