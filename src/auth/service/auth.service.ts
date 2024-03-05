import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserRole } from '../../users/schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/signup.dto';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

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
      email: user.email,
      sub: user._id,
    });

    return { token };
  }

  async signUp(signUpDto: SignUpDto) {
    const { firstName, lastName, email, password, confirmPassword } = signUpDto;
    if (password !== confirmPassword) {
      throw new UnauthorizedException('Passwords do not match');
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

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
      role: UserRole.USER,
    });

    // create token
    const token = this.jwtService.sign({
      email: newUser.email,
      sub: newUser._id,
    });

    return { token };
  }
}
