import UserService from "../../services/User/userService";
import CountryService from "../../services/Admin/countryService";
import LanguageService from "../../services/Admin/languageService";
import { Request, Response } from 'express'
import PasswordUtils from "../../utils/passwordUtils";
import JwtUtils from "../../utils/jwtUtils";
import mailUtils from "../../utils/mailUtils";
import { CustomRequest } from "../../middlewares/authenticationMiddleware";
import { ObjectId, Types } from "mongoose";
import { Subscription } from "../../models/User/subscriptionModel";


class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService

  }

  private generateSixDigitOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async postSignup(req: Request, res: Response): Promise<void> {
    try {
      const user = req.body
      const existingUser = await this.userService.findByEmail(user.email)
      if (existingUser) {
        res.status(200).json({ message: "User already exists" })
      } else {
        const hashedPassword = await PasswordUtils.hashPassword(user.password)
        user.password = hashedPassword
        const newUser = await this.userService.createUser(user)
        res.status(201).json(newUser)
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async postLogin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body

      const { user, message } = await this.userService.authenticateUser(email, password)

      if (!user) {
        if (message === 'No user is registered with this email') {
          res.status(404).json({ message })
          return
        }
        else if (message === 'Invalid password') {
          res.status(401).json({ message })
          return
        } else if (message === 'Your account is blocked') {
          res.status(403).json({ message })
          return
        }
      }


      if (user?.isSubscribed && user?.expirationDate) {
        const currentDate = new Date()
        if (currentDate > user?.expirationDate) {
          user.isSubscribed = false
          user.expirationDate = null
          await this.userService.update(user._id as string, user)
        }
      }

      console.log('token undakkan pohn')
      const accessToken = JwtUtils.generateAccessToken({ email: user?.email })
      const refreshToken = JwtUtils.generateRefreshToken({ email: user?.email })

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 1 * 60 * 60 * 1000
      });
      res.status(200).json({ message: 'Login successful', accessToken, user });

    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
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

  async check(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        const email = req.user
        const user = await this.userService.findByEmail(email)
        if (user?.isBlocked) {
          res.send(403).json({ Message: 'blocked' })
          return
        }
        res.status(200).send(user)
      }
    } catch (error) {

    }
  }

  async getUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (req.user) {
        const email = req.user
        const user = await this.userService.findByEmail(email)
        if (!user) {
          res.status(404).send({ error: 'User not found' });
          return
        } if (user.isBlocked) {
          res.status(403).send({ error: 'User is blocked' })
          return
        }
        res.status(200).send(user);
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }





  async updateUser(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).send({ error: 'Unauthorized' });
        return
      }
      const email = req.user
      const existingUser = await this.userService.findByEmail(email)
      if (!existingUser) {
        res.status(404).send({ error: 'User not found' });
        return
      }
      const user = req.body
      const updatedUser = this.userService.update(existingUser._id as string, user)
      res.status(200).json(updatedUser)
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage })
    }
  }

  async uploadUserImage(req: CustomRequest, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }
      console.log(req.file, 'file back')
      if (!req.user) {
        res.status(401).send({ message: 'Unauthorized' });
        return
      }
      const email = req.user
      const user = await this.userService.findByEmail(email)
      if (!user) {
        res.status(404).send({ message: "User not found with this email" })
        return
      }

      const fileUrl = (req.file as any).location;
      const imageType = req.query.type;
      if (imageType === 'profile') {
        user.profilePhoto = fileUrl;
      } else {
        res.status(400).json({ message: 'Invalid image type' });
        return;
      }
      const updatedUser = await this.userService.update(user._id as string, user)
      res.status(200).send()
    } catch (error) {
      let errorMessage = 'An unexpected error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage })
    }
  }


  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const { search = '', page = 1, limit = 10 } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      const result = await this.userService.findAll(pageNum, limitNum, search as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }

  async unblockUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updatedUser = await this.userService.update(id, { isBlocked: false })
      if (updatedUser) {
        res.status(200).json(updatedUser)
      } else {
        console.log('Usrene kaanan illa')
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async blockUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params
      const updatedUser = await this.userService.update(id, { isBlocked: true })
      if (updatedUser) {
        res.status(200).json(updatedUser)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })
    }
  }


  async getUserById(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const userId = user?._id as Types.ObjectId
      const { nativeId } = req.params
      const nativeUser = await this.userService.findById(nativeId)
      let connectionStatus: string = 'No relation';
      if (nativeUser?.connections.includes(userId)) {
        connectionStatus = 'Connected'
      } else if (nativeUser?.sentRequests.includes(userId)) {
        connectionStatus = 'Requested'
      } else if (nativeUser?.receivedRequests.includes(userId)) {
        connectionStatus = 'Accept'
      }
      const result = { nativeUser, connectionStatus }
      res.status(200).send(result);
    } catch (error) {
      res.status(500).json({ message: "Unexpected server error" })

    }
  }


  async getNativeSpeakers(req: CustomRequest, res: Response): Promise<void> {
    try {
      const { search = '', page = 1, limit = 10, filterCountry, filterLanguage } = req.query;
      const pageNum = parseInt(page as string, 10);
      const limitNum = parseInt(limit as string, 10);

      if (req.user) {
        const email = req.user;
        const user = await this.userService.findByEmail(email);
        const userId = user?._id as string;

        const result = await this.userService.findNativeSpeakers(
          userId,
          pageNum,
          limitNum,
          search as string,
          filterLanguage as string,
          filterCountry as string
        );
        res.status(200).json(result);
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }



  async sendConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { receiverId } = req.body;

      if (!senderId || !receiverId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }

      const result = await this.userService.sendConnectionRequest(senderId, receiverId);
      const connectionStatus = 'Accept'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }


  async cancelConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { cancelId } = req.body;

      if (!senderId || !cancelId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }

      const result = await this.userService.cancelConnectionRequest(senderId, cancelId);
      const connectionStatus = 'Requested'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }


  async rejectConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { rejectId } = req.body;
      if (!senderId || !rejectId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }

      const result = await this.userService.rejectConnectionRequest(senderId, rejectId);
      const connectionStatus = 'Requested'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }

  async acceptConnectionRequest(req: CustomRequest, res: Response): Promise<void> {
    try {
      const email = req.user
      const user = await this.userService.findByEmail(email as string)
      const senderId = user?._id as string
      const { acceptId } = req.body;
      if (!senderId || !acceptId) {
        res.status(400).json({ message: 'Missing sender or receiver ID' });
        return;
      }
      const result = await this.userService.acceptConnectionRequest(senderId, acceptId);
      const connectionStatus = 'Requested'
      const final = { result, connectionStatus }
      if (result) {
        res.status(200).json({ message: 'Connection request sent', final });
      } else {
        res.status(404).json({ message: 'Sender or receiver not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Unexpected server error' });
    }
  }

  async updateSubscription(req: Request, res: Response): Promise<void> {
    try {
      const { email, orderId } = req.body
      const user = await this.userService.findByEmail(email)
      if (user) {
        const userId = user._id
        const currentDate = new Date();
        const expirationdate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
        const updatedUser = await this.userService.update(userId as string, { isSubscribed: true, expirationDate: expirationdate })
        const subscription = new Subscription({
          userId: userId as string,
          amount: 199,
          orderId: orderId as string,
          expirationDate: expirationdate
        })
        const updateSubscription = await subscription.save()
        res.status(200).send(updatedUser)
      }
    } catch (error) {

    }
  }

}

export default UserController