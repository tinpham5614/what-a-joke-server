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
  const loginDto = {
    email: 'mock@email.com',
    password: 'mockPassword'
  };

  beforeEach(() => {
    service = new AuthService(userModel, new JwtService({}));
    controller = new AuthController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('logIn', () => {
    it('should return a token', async () => {
      jest.spyOn(service, 'logIn').mockResolvedValue({ token });
      expect(await controller.login(loginDto)).toEqual({ token });
    });
  });
});
