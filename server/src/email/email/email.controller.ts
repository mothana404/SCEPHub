import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailDto } from './dto/email.dto';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  //   @Post('send-verification')
  //   async sendVerificationEmail(@Body() body: { email: string }) {
  //     const { email } = body;
  //     try {
  //       const verificationToken =
  //         this.emailService.generateVerificationToken(email);
  //       const verificationLink = `http://localhost:3000/verify-email?token=${verificationToken}`;
  //       await this.emailService.sendVerificationEmail(email, verificationLink);
  //       return { message: 'Verification email sent successfully' };
  //     } catch (error) {
  //       console.error('Error sending verification email:', error);
  //       return { message: 'Failed to send verification email' };
  //     }
  //   }

  //   @Get('verify-email')
  //   async verifyEmail(@Query('token') token: string) {
  //     try {
  //       const isVerified = await this.emailService.verifyToken(token);
  //       if (isVerified) {
  //         return { message: 'Email verified successfully' };
  //       }
  //       return { message: 'Invalid or expired token' };
  //     } catch (error) {
  //       console.error('Error verifying email:', error);
  //       return { message: 'Error during email verification' };
  //     }
  //   }

  //   @Post('send-regular')
  //   async sendRegularEmail(@Body() sendEmailDto: EmailDto) {
  //     try {
  //       return await this.emailService.sendEmail(sendEmailDto);
  //     } catch (error) {
  //       console.error('Error sending regular email:', error);
  //       return { message: 'Failed to send email' };
  //     }
  //   }
}
