import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailService } from '../../services/email/email.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly emailService: EmailService,
    private readonly userService: UserService,
  ) {}

  async sendEmailVerification(email: string): Promise<void> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    const { id } = user;
    const encodedId = Buffer.from(id).toString('base64');
    const url = `http://localhost:3000/email-verification/${encodedId}`;
    const options = {
      from: '',
      to: email,
      subject: 'Email verification',
      html: `Please click this link to verify your email: <a href="${url}">${url}</a>`,
    };
    return this.emailService.sendEmail(options);
  }

  async verifyEmail(encodedId: string): Promise<boolean> {
    const user = await this.userService.getUserById(encodedId);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already verified');
    }
    return await this.userService.confirmEmail(user.email);
  }
}
