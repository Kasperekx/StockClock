import { Injectable } from '@nestjs/common';
import * as Nodemailer from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly nodeMailerTransporter: Nodemailer;
  constructor() {
    this.nodeMailerTransporter = createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: 'piotr.kasperek92@gmail.com',
        pass: 'vgdnvdcaoimqfbwn',
      },
    });
  }

  async sendEmail(options: Nodemailer.Options): Promise<void> {
    await this.nodeMailerTransporter.sendMail(options);
  }
}
