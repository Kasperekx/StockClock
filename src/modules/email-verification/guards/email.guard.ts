import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const getByEmail = await this.userService.findUserByEmail(
      request.body.email,
    );
    if (getByEmail.isEmailConfirmed) {
      console.log('Logged in');
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
