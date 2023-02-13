import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '../database/entities/user.entity';
import { UserService } from '../user/user.service';
import { ValidateUserDto } from './network/dtos/ValidateUser.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

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

  async login(user: UserEntity): Promise<UserEntity> {
    try {
      console.log('Logged in');
      return await user;
    } catch (error) {
      console.log(error);
    }
  }
}
