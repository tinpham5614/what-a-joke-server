import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../service/users.service';
import { User } from '../schema/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockService = {
    findUserById: jest.fn(),
  };

  const mockUser = {
    _id: 'mockId',
    firstName: 'mockFirstName',
    lastName: 'mockLastName',
    email: 'mockEmail@email.com',
    password: 'mockPassword',
    role: 'USER'
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: mockService
      }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findUserById', () => {
    it('should return a user', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(mockUser);
      const result = await controller.findUserById(mockUser._id);
      expect(service.findUserById).toHaveBeenCalledWith(mockUser._id);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(service, 'findUserById').mockResolvedValue(null);
      try {
        await controller.findUserById(mockUser._id);
      } catch (error) {
        expect(error.message).toEqual('Could not find user.');
      }
    });
  });
});

