import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class MailUtils {
  static async sendOtp(email: string, otp: string): Promise<{ email: string, otp: string, message: string }> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.OTP_SENDER_EMAIL,
        pass: process.env.OTP_SENDER_PASSWORD,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verbofly OTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff border-radius: 5px; border: 1px solid #ffd700;">
          <tr>
            <td style="padding: 20px; background-color: #374151; text-align: center;">
              <h1 style="color:#ffffff; margin: 0;">Verbofly</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <h2 style="color: #333; margin-bottom: 20px;">Password Reset OTP</h2>
              <p style="margin-bottom: 15px;">Hello,</p>
              <p style="margin-bottom: 15px;">You've requested to reset your password for your Verbofly account. Use the following OTP to complete the process:</p>
              <div style="background-color: #ffd700; border-radius: 5px; padding: 15px; text-align: center; margin-bottom: 20px;">
                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${otp}</span>
              </div>
              <p style="margin-bottom: 15px;">This OTP will expire in 10 minutes. If you didn't request this password reset, please ignore this email or contact our support team if you have any concerns.</p>
              <p style="margin-bottom: 20px;">Thank you for using Verbofly!</p>
              <p style="color: #666; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #ffffff; color: #333; text-align: center; padding: 10px; font-size: 12px;">
              © 2024 Verbofly. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.OTP_SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP - Verbofly',
      html: htmlContent,
    };

    try {
      await transporter.sendMail(mailOptions);
      return { email, otp, message: 'OTP sent successfully' };
    } catch (error) {
      throw new Error('Failed to send OTP email');
    }
  }
}

export default MailUtils;