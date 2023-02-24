import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from '../user/network/dtos/CreateUser.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LoginUserDto } from './network/dtos/LoginUser.dto';

describe('Auth Service', () => {
  let authService: AuthService;
  let userService: UserService;
  let emailVerificationService: EmailVerificationService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            createUser: jest.fn(),
            findUserByEmail: jest.fn(),
          },
        },
        {
          provide: EmailVerificationService,
          useValue: {
            sendEmailVerification: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UserService>(UserService);
    emailVerificationService = moduleRef.get<EmailVerificationService>(
      EmailVerificationService,
    );
  });

  describe('register', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const newUser: CreateUserDto = {
      ...createUserDto,
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (userService.createUser as jest.Mock).mockResolvedValue(newUser);
      (
        emailVerificationService.sendEmailVerification as jest.Mock
      ).mockResolvedValue(undefined);
    });

    it('should create a new user and send email verification when given valid input data', async () => {
      const result = await authService.register(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(
        emailVerificationService.sendEmailVerification,
      ).toHaveBeenCalledWith(createUserDto.email);
      expect(result).toEqual(newUser);
    });

    it('should throw an error when the user service throws an error', async () => {
      const errorMessage = 'An error occurred while creating the user';
      (userService.createUser as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(authService.register(createUserDto)).rejects.toThrowError(
        errorMessage,
      );
    });

    it('should throw an error when the email verification service throws an error', async () => {
      const errorMessage =
        'An error occurred while sending the email verification';
      (
        emailVerificationService.sendEmailVerification as jest.Mock
      ).mockRejectedValue(new Error(errorMessage));

      await expect(authService.register(createUserDto)).rejects.toThrowError(
        errorMessage,
      );
    });
  });

  describe('login', () => {
    const payload: LoginUserDto = {
      email: 'test123@gmail.com',
      password: 'password123!',
    };

    beforeEach(() => {
      jest.clearAllMocks();
      (userService.findUserByEmail as jest.Mock).mockResolvedValue(payload);
    });

    it('should return the user when given valid input data', async () => {
      const result = await authService.login(payload);

      expect(userService.findUserByEmail).toHaveBeenCalledWith(payload.email);
      expect(result).toEqual(payload);
    });

    it('should throw an error when the user service throws an error', async () => {
      const errorMessage = 'An error occurred while finding the user';
      (userService.findUserByEmail as jest.Mock).mockRejectedValue(
        new Error(errorMessage),
      );

      await expect(authService.login(payload)).rejects.toThrowError(
        errorMessage,
      );
    });
  });
});
