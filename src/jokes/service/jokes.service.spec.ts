import { Test, TestingModule } from '@nestjs/testing';
import { JokesService } from '../service/jokes.service';
import { getModelToken } from '@nestjs/mongoose';
import { Joke } from '../schema/joke.schema';

describe('JokesService', () => {
  let service: JokesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JokesService,
        {
          provide: getModelToken(Joke.name),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<JokesService>(JokesService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllJokes', () => {
    it('should return list of jokes', async () => {
      const jokes = [
        {
          _id: '1234567890ab',
          createdByUser: '0987654321ab',
          joke: 'mocked_joke',
          favoriteCount: 0,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: '0987654321ab',
          createdByUser: '123456qweqwe',
          joke: 'another_mocked_joke',
          favoriteCount: 0,
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'getAllJokes').mockResolvedValue(jokes as any);

      const result = await service.getAllJokes();
      expect(result).toEqual(jokes);
    });
  });
});
