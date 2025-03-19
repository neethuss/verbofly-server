import AdminService from "../../services/Admin/adminService";
import { Request, Response } from "express";
import JwtUtils from "../../utils/jwtUtils";

class AdminController {
  private adminService: AdminService

  constructor(adminService: AdminService) {
    this.adminService = adminService
  }

  async postLogin(req: Request, res: Response): Promise<void> {
    try {
      console.log('backend vann')
      const { email, password } = req.body
      const isAdmin = await this.adminService.findByEmail(email)
      console.log('exist', isAdmin)
      if (isAdmin) {
        const isPassword = await password === isAdmin.password
        if (isPassword) {
          const accessToken = JwtUtils.generateAccessToken({ email: isAdmin.email })
          const refreshToken = JwtUtils.generateRefreshToken({email: isAdmin.email})
  
          res.cookie("adminRefreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 
          });
          console.log('succ')
          res.status(200).json({ message: 'Login successful', accessToken, isAdmin });
        } else {
          res.status(401).json({ message: 'Incorrect password' })
        }
      } else {
        res.status(401).json({ message: 'Email is incorrect' })
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

export default AdminController