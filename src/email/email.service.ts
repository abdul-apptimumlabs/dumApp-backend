import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { google } from 'googleapis';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendVerificationEmail(to, userId, userToken) {
    try {
      const OAuth2 = google.auth.OAuth2;
      const clientID = this.configService.get('GOOGLE_CLIENT_ID');
      console.log(clientID);

      const OAuth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );
      OAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });

      const accessToken = OAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_SENDER_MAIL,
          pass: process.env.MAIL_SENDER_PASS,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });

      const mailOptions = {
        from: process.env.MAIL_SENDER_MAIL,
        to: to,
        subject: 'Email Verification',
        text: 'Email Verification',
        html: `<p>Dear User, please verify your email for Social Network project.</p>
        <p>
            This <a href="https://dumapp.herokuapp.com/api/auth/verify/${userId}/${userToken}">link</a> will verify your email address.
        </p>
        <p>
            If you did not registered on Social Network project, you can just ignore this message and do not click on the link!
        </p>`,
      };

      await transport.sendMail(mailOptions, function (error, result) {
        if (error) {
          console.log(error);

          return error;
        } else {
          console.log(result);

          return result;
        }
        transport.close();
      });
    } catch (error) {
      //best try
    }
  }

  sendPasswordResetEmail(to, userId, resetToken) {
    try {
      const OAuth2 = google.auth.OAuth2;
      const clientID = this.configService.get('GOOGLE_CLIENT_ID');
      console.log(clientID);

      const OAuth2Client = new OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );
      OAuth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      });

      const accessToken = OAuth2Client.getAccessToken();

      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_SENDER_MAIL,
          pass: process.env.MAIL_SENDER_PASS,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      const mailOptions = {
        from: process.env.MAIL_SENDER_MAIL,
        to: to,
        subject: 'Password Reset',
        text: 'Password Reset',
        html: `<p>Dear User, you requested password reset.</p>
        <p>
            This <a href="https://dumapp.herokuapp.com/resetpassword/${userId}/${resetToken}">link</a> will help you to reset your password.
        </p>
        <p>
            If it was not you, who requested password reset, you can just ignore this message and do not click on the link!
        </p>`,
      };
      transport.sendMail(mailOptions, function (error, result) {
        if (error) {
          return error;
        } else {
          return result;
        }
        transport.close();
      });
    } catch (error) {
      //best try
    }
  }
}
