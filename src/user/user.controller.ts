import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './network/dtos/CreateUser.dto';
import { JoiValidationPipe } from '../utils/pipes/joi-validation.pipe';
import { createUserSchema } from './network/schemas/createUserSchema';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/register')
  @ApiBody({ type: CreateUserDto })
  @UsePipes(new JoiValidationPipe(createUserSchema))
  register(@Body() user: CreateUserDto) {
    return this.userService.createUser(user);
  }
}
