import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { GoogleUserDTO } from '../network/dtos/GoogleUser.dto';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../database/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<UserEntity> {
    const user: GoogleUserDTO = {
      email: profile.emails[0].value,
      displayName: profile.displayName,
    };
    console.log(profile);

    return this.authService.validateGoogleUser(user);
  }
}
