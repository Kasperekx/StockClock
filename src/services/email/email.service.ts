import { Injectable } from '@nestjs/common';
import * as Nodemailer from 'nodemailer/lib/mailer';
import { createTransport } from 'nodemailer';
import * as process from 'process';

@Injectable()
export class EmailService {
  private readonly nodeMailerTransporter: Nodemailer;
  constructor() {
    this.nodeMailerTransporter = createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: process.env.AUTH_MAIL,
        pass: process.env.AUTH_PASS,
      },
    });
  }

  async sendEmail(options: Nodemailer.Options): Promise<void> {
    await this.nodeMailerTransporter.sendMail(options);
  }
}
