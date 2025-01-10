import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private verificationTokens: Map<string, string>; // Replace with a database in production
  private oauth2Client: OAuth2Client;

  constructor() {
    // Initialize the OAuth2 client with your credentials
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    // Set your refresh token (get this after authenticating the app)
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    // Initialize nodemailer transporter with OAuth2
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.GOOGLE_EMAIL, // Your Gmail email address
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      },
    });

    this.verificationTokens = new Map();
  }

  // Get access token from Google API using refresh token
  private async getAccessToken(): Promise<string> {
    const accessToken = await this.oauth2Client.getAccessToken();
    return accessToken.token;
  }

  //   async sendEmail(to: string, subject: string, text: string): Promise<void> {
  //     try {
  //       const accessToken = await this.getAccessToken();

  //       const mailOptions = {
  //         from: process.env.GOOGLE_EMAIL,
  //         to,
  //         subject,
  //         text,
  //         auth: {
  //           type: 'OAuth2',
  //           user: process.env.GOOGLE_EMAIL,
  //           accessToken, // Use access token here
  //         },
  //       };

  //       await this.transporter.sendMail(mailOptions);
  //     } catch (error) {
  //       console.error('Error sending email:', error);
  //     }
  //   }

  //   async sendVerificationEmail(
  //     to: string,
  //     verificationLink: string,
  //   ): Promise<void> {
  //     const subject = 'Email Verification';
  //     const text = `Please verify your email by clicking the following link: ${verificationLink}`;
  //     await this.sendEmail(to, subject, text);
  //   }

  //   generateVerificationToken(email: string): string {
  //     const token = crypto.randomBytes(32).toString('hex');
  //     this.verificationTokens.set(token, email);
  //     setTimeout(() => this.verificationTokens.delete(token), 3600000); // Expire token in 1 hour
  //     return token;
  //   }

  //   async verifyToken(token: string): Promise<boolean> {
  //     if (this.verificationTokens.has(token)) {
  //       this.verificationTokens.delete(token); // Token can only be used once
  //       return true;
  //     }
  //     return false;
  //   }
}
