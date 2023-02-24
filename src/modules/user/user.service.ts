import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './network/dtos/CreateUser.dto';
import { UserEntity } from '../database/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async createUser(user: CreateUserDto): Promise<UserEntity> {
    const hashedPass = await argon2.hash(user.password);
    try {
      const newUser = this.userRepository.create({
        ...user,
        password: hashedPass,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      if (error.code === '23505') {
        const message = error.detail.replace(
          /^Key \((.*)\)=\((.*)\) (.*)/,
          'The $1 $2 already exists.',
        );
        throw new ConflictException(message);
      } else {
        throw new Error(error);
      }
    }
  }

  async createGoogleUser(email: string) {
    try {
      const emailFirstPart = email.split('@')[0];
      const user = await this.userRepository.create({
        email,
        displayName: emailFirstPart,
        isEmailConfirmed: true,
      });
      return this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        const message = error.detail.replace(
          /^Key \((.*)\)=\((.*)\) (.*)/,
          'The $1 $2 already exists.',
        );
        throw new ConflictException(message);
      } else {
        throw new Error(error);
      }
    }
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user;
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await argon2.verify(hashedPassword, password);
  }

  async getUserById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      return null;
    }
    return user;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    if (!this.userRepository) {
      throw new Error('User repository not found');
    }
    return this.userRepository.find();
  }

  async confirmEmail(email: string): Promise<boolean> {
    await this.userRepository.update(
      {
        email,
      },
      {
        isEmailConfirmed: true,
      },
    );
    return true;
  }

  async changePassword(id: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }
    if (await this.comparePassword(password, user.password)) {
      throw new Error('New password cannot be same as old password');
    }
    const hashedPass = await argon2.hash(password);
    await this.userRepository.update(
      {
        id,
      },
      {
        password: hashedPass,
      },
    );
  }
}
