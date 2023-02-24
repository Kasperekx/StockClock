import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserEntity } from '../database/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockRepository } from '../../utils/helpers/mock.repository';
import { CreateUserDto } from './network/dtos/CreateUser.dto';

describe('UserService', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const result: UserEntity[] = [];
      jest
        .spyOn(userService, 'getAllUsers')
        .mockImplementation(() => Promise.resolve(result));

      expect(await userService.getAllUsers()).toEqual(result);
    });
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      const user: CreateUserDto = {
        email: 'test@gmail.com',
        password: 'Password123!',
      };
      jest
        .spyOn(userService, 'createUser')
        .mockImplementation(() => Promise.resolve(user).then());
      expect(await userService.createUser(user)).toEqual(user);
    });
  });
});
