import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

class mailUtils {
  
  static async sendOtp(email: string, otp: string): Promise<{ email: string, otp: string, message: string }> {
  
      console.log('send')
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.OTP_SENDER_EMAIL,
          pass: process.env.OTP_SENDER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.OTP_SENDER_EMAIL,
        to: email,
        subject: 'Hello, This is from TalkTrek,',
        text: `Your OTP for password reset is: ${otp}`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
        return { email, otp, message: 'OTP sent successfully' };
      } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
      }
    
  }
}

export default mailUtils;
