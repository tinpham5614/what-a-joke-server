import { TestingModule, Test } from '@nestjs/testing';
import { Joke } from '../schema/joke.schema';
import { JokesService } from '../service/jokes.service';
import { JokesController } from './jokes.controller';

describe('JokesController', () => {
  // Declaring the controller and service
  let controller: JokesController;
  let service: JokesService;

  // Mocking the service
  const mockService = {
    getJokeById: jest.fn(),
  };

  // Mocking the joke
  const mockJokes = {
    _id: '6631f30d7fe01415e3e0b147',
    createdByUser: '65faa0690df62178d8a6edaa',
    joke: 'mockJoke',
    favoriteCount: 0,
    isDeleted: false,
  } as unknown as Joke;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JokesController],
      providers: [
        {
          provide: JokesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<JokesController>(JokesController);
    service = module.get<JokesService>(JokesService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getJokeById', () => {
    it('should return a joke', async () => {
      jest.spyOn(service, 'getJokeById').mockResolvedValue(mockJokes);
      const result = await controller.getJokeById(mockJokes._id);
      expect(service.getJokeById).toHaveBeenCalledWith(mockJokes._id);
      expect(result).toEqual(mockJokes);
    });

    it('should throw NotFoundException if no jokes are found', async () => {
      jest.spyOn(service, 'getJokeById').mockResolvedValue(null);
      try {
        await controller.getJokeById(mockJokes._id);
      } catch (error) {
        expect(error.message).toEqual('No jokes found.');
      }
    });
  });
});
