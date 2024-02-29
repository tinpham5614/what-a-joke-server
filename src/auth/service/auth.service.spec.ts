import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from '../dto/signup.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    const mockUser = {
      _id: '1234567890ab',
      email: 'mockEmail',
      password: bcrypt.hash('mockPassword', 10),
    } as User;

    it('should return a token', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('mocked_token');

      const result = await service.logIn(mockUser);
      expect(result).toEqual({ token: 'mocked_token' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce(null);
      try {
        await service.logIn(mockUser);
      } catch (error) {
        expect(error.message).toEqual('Invalid credentials');
      }
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      try {
        await service.logIn({
          email: mockUser.email,
          password: 'invalid_password',
        });
      } catch (error) {
        expect(error.message).toEqual('Invalid credentials');
      }
    });
  });

  describe('signUp', () => {
    const newMockUser: SignUpDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'password',
      confirmPassword: 'password',
    };

    const hashedPassword = bcrypt.hash(newMockUser.password, 10);
    const mockToken = 'mocked_token';
    it('should return a token', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest
        .spyOn(userModel, 'create')
        .mockResolvedValue({ ...newMockUser, password: hashedPassword } as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue(mockToken);

      const result = await service.signUp(newMockUser);
      expect(result).toEqual({ token: mockToken });
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      try {
        await service.signUp({ ...newMockUser, confirmPassword: 'invalid_password'});
      } catch (error) {
        expect(error.message).toEqual('Passwords do not match');
      }
    });

    it('should throw UnauthorizedException if user already exists', async () => {
      jest.spyOn(userModel, 'findOne').mockReturnValueOnce({
        exec: jest.fn().mockResolvedValue(newMockUser),
      } as any);
      try {
        await service.signUp(newMockUser);
      } catch (error) {
        expect(error.message).toEqual('User already exists');
      }
    });
  });
});
