import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserModule } from '../user/user.module';
import { LocalStrategy } from './strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from '../../utils/serializers/SessionSerializer';
import { EmailVerificationModule } from '../email-verification/email-verification.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({
      session: true,
    }),
    EmailVerificationModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
