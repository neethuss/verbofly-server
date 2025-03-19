import { Router } from "express";
import UserController from "../../controllers/User/userController";
import UserService from "../../services/User/userService";
import UserRepositoryImplementation from "../../repositories/implementation/User/userRepositoryImplementation";

import CountryController from "../../controllers/Admin/countryController";
import CountryService from "../../services/Admin/countryService";
import CountryRepositoryImplentation from "../../repositories/implementation/Admin/countryRepositoryImplementation";

const countryRepositoryImplementation = new CountryRepositoryImplentation()
const countryService = new CountryService(countryRepositoryImplementation)
const countryController = new CountryController(countryService)

import LanguageController from "../../controllers/Admin/languageController";
import LanguageService from "../../services/Admin/languageService";
import LanguageRepositoryImplementation from "../../repositories/implementation/Admin/languageRespositoryImplementation";

const languageRepositoryImplementation = new LanguageRepositoryImplementation()
const languageService = new LanguageService(languageRepositoryImplementation)
const languageController = new LanguageController(languageService)

import LessonController from "../../controllers/Admin/lessonController";
import LessonService from "../../services/Admin/lessonService";
import LessonRepositoryImplementation from "../../repositories/implementation/Admin/lessonRepositoryImplementation";

const lessonRepositoryImplementation = new LessonRepositoryImplementation()
const lessonService = new LessonService(lessonRepositoryImplementation)
const lessonController = new LessonController(lessonService)

import ProgressController from "../../controllers/User/progressController";
import ProgressService from "../../services/User/progressService";
import ProgressRepositoryImplementation from "../../repositories/implementation/User/progressRepositoryImplementation";

const progressRepositoryImplementation = new ProgressRepositoryImplementation()
const progressService = new ProgressService(progressRepositoryImplementation)


const userRepositoryImplementation = new UserRepositoryImplementation()
const userService = new UserService(userRepositoryImplementation)
const userController = new UserController(userService)
const progressController = new ProgressController(progressService, userService, lessonService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import upload from "../../middlewares/uploadMiddleware";
import isBlockedMiddleware from "../../middlewares/isBlockedMiddleware";

const router = Router()

router.post('/signup',(req,res) => userController.postSignup(req, res))
router.post('/login', (req, res) => userController.postLogin(req, res))
router.post('/forgotPassword',(req,res) => userController.postForgotPassword(req,res))
router.post('/verifyOtp',(req,res) => userController.postVerifyOtp(req,res))
router.post('/resetPassword',(req,res) => userController.postResetPassword(req,res))
router.get('/user',authenticationMiddleware,(req,res) => userController.getUser(req,res))
router.get('/users', authenticationMiddleware,(req,res)=> userController.getUsers(req,res))

router.patch('/user/block/:id', authenticationMiddleware, (req,res)=> userController.blockUser(req,res))
router.patch('/user/unblock/:id', authenticationMiddleware, (req,res)=> userController.unblockUser(req,res))


router.patch('/user', authenticationMiddleware, (req, res)=> userController.updateUser(req,res))
router.post('/upload',authenticationMiddleware,upload.single('file'),(req, res) => userController.uploadUserImage(req, res) )

router.get('/:nativeId', authenticationMiddleware, isBlockedMiddleware,(req, res) => userController.getUserById(req,res))
router.get('/native/speakers', authenticationMiddleware, (req, res) => userController.getNativeSpeakers(req, res));
router.get('/languages/:id', authenticationMiddleware, (req, res) => languageController.getLangugage(req,res))

router.get('/progress/userProgress', authenticationMiddleware, (req,res) => progressController.findProgressByUserId(req, res))
router.post('/progress', authenticationMiddleware, (req, res) => progressController.updateOrCreateProgress(req, res));
router.get('/lessonProgress/:languageId/:categoryId', authenticationMiddleware, (req,res) => progressController.findLessonsWithProgress(req,res))

router.patch('/sendConnection', authenticationMiddleware, (req,res)=> userController.sendConnectionRequest(req,res))
router.patch('/cancelConnection', authenticationMiddleware, (req,res)=> userController.cancelConnectionRequest(req,res))
router.patch('/rejectConnection', authenticationMiddleware, (req,res)=> userController.rejectConnectionRequest(req,res))
router.patch('/acceptConnection', authenticationMiddleware, (req,res)=> userController.acceptConnectionRequest(req,res))

router.patch('/payment/update-subscription', (req, res) => userController.updateSubscription(req, res))

router.get('/check', authenticationMiddleware, (req, res)=> userController.check(req,res))


export default router