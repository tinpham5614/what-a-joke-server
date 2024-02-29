import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';;
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';

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
    confirmPassword: 'password'
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
      jest.spyOn(service, 'logIn').mockResolvedValue({ token });
      expect(await controller.login(mockUser)).toEqual({ token });
    });
  });

  describe('signUp', () => {
    it('should return a token', async () => {
      jest.spyOn(service, 'signUp').mockResolvedValue({ token });
      expect(await controller.signUp(newMockUser)).toEqual({ token });
    });
  });
});
