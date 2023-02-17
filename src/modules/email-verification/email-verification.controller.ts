import { Controller, Get, Param } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';

@Controller('email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Get(':encodedUserId')
  verifyEmail(@Param('encodedUserId') encodedUserId: string): Promise<boolean> {
    const userId = Buffer.from(encodedUserId, 'base64').toString();
    return this.emailVerificationService.verifyEmail(userId);
  }
}
