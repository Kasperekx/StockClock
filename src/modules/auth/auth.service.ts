import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../database/entities/user.entity';
import { UserService } from '../user/user.service';
import { ValidateUserDto } from './network/dtos/ValidateUser.dto';
import { CreateUserDto } from '../user/network/dtos/CreateUser.dto';
import { LoginUserDto } from './network/dtos/LoginUser.dto';
import { EmailVerificationService } from '../email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async validateUser({
    email,
    password,
  }: ValidateUserDto): Promise<UserEntity> {
    const user = await this.userService.findUserByEmail(email);
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    const isPasswordMatching = await this.userService.comparePassword(
      password,
      user.password,
    );
    if (isPasswordMatching) return user;
    else
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }

  async register(payload: CreateUserDto): Promise<UserEntity> {
    try {
      const newUser = await this.userService.createUser(payload);
      await this.emailVerificationService.sendEmailVerification(payload.email);
      return newUser;
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(userDTO: LoginUserDto): Promise<UserEntity> {
    return await this.userService.findUserByEmail(userDTO.email);
  }
}
