import UserService from "../../services/User/userService";
import { Request, Response } from 'express'
import PasswordUtils from "../../utils/passwordUtils";
import mailUtils from "../../utils/mailUtils";


class ForgotPasswordController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService

  }

  private generateSixDigitOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  
  async postForgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body
      const existingUser = await this.userService.findByEmail(email)
      if (existingUser) {
        const otp = this.generateSixDigitOtp()
        const mailer = await mailUtils.sendOtp(email, otp)
        res.status(200).json(mailer)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }



  async postVerifyOtp(req: Request, res: Response): Promise<void> {
    try {
      const { otpString, storedOtp } = req.body
      if (otpString === storedOtp) {
        res.status(200).json({ message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async postResetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await this.userService.findByEmail(email);
      if (user) {
        const hashedPassword = await PasswordUtils.hashPassword(password);
        const updatedUser = await this.userService.update(user._id as string, { password: hashedPassword });
        if (updatedUser) {
          res.status(200).json({ message: 'Password updated successfully' });
        } else {
          res.status(400).json({ message: 'Failed to update password' });
        }
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }




}

export default ForgotPasswordController