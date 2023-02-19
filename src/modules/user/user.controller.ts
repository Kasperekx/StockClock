import { Throttle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  getUserById(@Body('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Throttle(2, 60)
  @Put(':id/password')
  changePassword(
    @Param('id') id: string,
    @Body('password') password: string,
  ): Promise<void> {
    return this.userService.changePassword(id, password);
  }
}
