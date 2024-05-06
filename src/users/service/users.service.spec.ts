import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../service/users.service';
import { Role, User } from '../schema/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  const mockUser = {
    id: '1234567890ab',
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'mockEmail',
    role: Role.USER,
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, {
        provide: getModelToken(User.name),
        useValue: {
          findById: jest.fn(),
        },
      }],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      const result = await service.findUserById(mockUser._id);
      expect(result).toEqual(mockUser as any);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      try {
        await service.findUserById(mockUser._id);
      } catch (error) {
        expect(error.message).toEqual('Could not find user.');
      }
    });

    it('should throw NotFoundException if findById throws an error', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Some Error')),
      } as any);
      try {
        await service.findUserById(mockUser._id);
      } catch (error) {
        expect(error.message).toEqual('Could not find user.');
      }
    });
  });
});
