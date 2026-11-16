import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    const port = Number(this.configService.get<string>('EMAIL_PORT') ?? 2525);

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST')?.trim(),
      port,
      secure: port === 465,
      auth: {
        user: this.configService.get<string>('EMAIL_USER')?.trim(),
        pass: this.configService.get<string>('EMAIL_PASS')?.trim(),
      },
    });
  }

  async sendEmail(to: string, subject: string, content: string) {
    const fromEmail = this.configService.get<string>('EMAIL_FROM')?.trim();
    const mailOptions = {
      from: `Gabriel <${fromEmail}>`,
      to,
      subject,
      text: content,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
