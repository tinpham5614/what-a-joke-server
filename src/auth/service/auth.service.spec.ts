import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { Model } from 'mongoose';
import { User } from '../../users/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<User> = {} as Model<User>;
  let jwtService: JwtService;
  const mockUser = {
    _id: '1234567890ab',
    email: 'mockEmail',
    password: bcrypt.hash('mockPassword', 10),
  } as User;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
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
});
