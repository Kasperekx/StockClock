import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Session,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from '../user/network/dtos/CreateUser.dto';
import { JoiValidationPipe } from '../../utils/pipes/joi-validation.pipe';
import { UserSchema } from '../user/network/schemas/createUserSchema';
import { UserEntity } from '../database/entities/user.entity';
import { AuthenticatedGuard, LocalAuthGuard } from './guards/local.guard';
import { LoginUserDto } from './network/dtos/LoginUser.dto';
import { GoogleGuard } from './guards/google.guard';
import { EmailVerificationGuard } from '../email-verification/guards/email.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(EmailVerificationGuard)
  @UseGuards(LocalAuthGuard)
  @UsePipes(new JoiValidationPipe(UserSchema))
  @ApiBody({ type: LoginUserDto })
  @Post('/login')
  login(@Body() payload: LoginUserDto): Promise<UserEntity> {
    return this.authService.login(payload);
  }
  @Post('/register')
  @ApiBody({ type: CreateUserDto })
  @UsePipes(new JoiValidationPipe(UserSchema))
  register(@Body() user: CreateUserDto): Promise<UserEntity> {
    return this.authService.register(user);
  }

  @Get('/google/login')
  @UseGuards(GoogleGuard)
  async googleAuth(@Request() req) {
    return await req.user;
  }

  @Get('/google/redirect')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Request() req) {
    return await req.user;
  }

  @Get('/session')
  async getAuthSession(@Session() session: Record<string, any>) {
    console.log(session.id);
    session.authenticated = true;
    return session;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('status')
  async getAuthStatus(@Request() req) {
    return req.user;
  }
}
