import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';;
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Role, User } from '../../users/schema/user.schema';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  const userModel: Model<User> = {} as Model<User>;
  const token = 'token';
  const mockUser = {
    email: 'mock@email.com',
    password: 'mockPassword'
  };

  const newMockUser = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    password: 'password',
    confirmPassword: 'password',
    role: Role.USER
  };

  beforeEach(() => {
    service = new AuthService(userModel, new JwtService({}));
    controller = new AuthController(service);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('logIn', () => {
    it('should return a token', async () => {
      jest.spyOn(service, 'logIn').mockResolvedValue({ token, subRole: Role.USER , sub: '123' }); 
      expect(await controller.login(mockUser)).toEqual({ token, subRole: Role.USER , sub: '123' });
    });
  });

  describe('signUp', () => {
    it('should return a token', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue({ token, userRole: Role.USER });
      expect(await controller.signUp(newMockUser)).toEqual({ token, userRole: Role.USER });
    });
  });
});
