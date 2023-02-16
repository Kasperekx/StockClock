import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../modules/user/user.service';
import { UserEntity } from '../../modules/database/entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }
  serializeUser(user: UserEntity, done: (err, user: UserEntity) => void) {
    done(null, user);
  }

  async deserializeUser(
    user: UserEntity,
    done: (err, user: UserEntity) => void,
  ) {
    const userDB = await this.userService.getUserById(user.id);
    return userDB ? done(null, userDB) : done(null, null);
  }
}
