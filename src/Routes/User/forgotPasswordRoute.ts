import { Router } from "express";
import ForgotPasswordController from "../../controllers/User/forgotPasswordController";
import UserService from "../../services/User/userService";
import UserRepositoryImplementation from "../../repositories/implementation/User/userRepositoryImplementation";





const userRepositoryImplementation = new UserRepositoryImplementation()
const userService = new UserService(userRepositoryImplementation)
const forgotPasswordController = new ForgotPasswordController(userService)

const router = Router()

router.post('/',(req,res) => forgotPasswordController.postForgotPassword(req,res))
router.post('/verifyOtp',(req,res) => forgotPasswordController.postVerifyOtp(req,res))
router.post('/resetPassword',(req,res) => forgotPasswordController.postResetPassword(req,res))

export default router