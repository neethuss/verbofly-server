import { Router } from "express";

const router = Router()

import QuizController from "../../controllers/Admin/quizController";
import QuizService from "../../services/Admin/quizService";
import QuizRepositoryImplementation from "../../repositories/implementation/Admin/quizRepositoryImplementation";
const quizRepositoryImplementation = new QuizRepositoryImplementation()
const quizService = new QuizService(quizRepositoryImplementation)
const quizController = new QuizController(quizService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import upload from "../../middlewares/uploadMiddleware";

router.post('/addQuiz',authenticationMiddleware,  (req,res) => quizController.postCreateQuiz(req,res))
router.get('/quizzes', authenticationMiddleware, (req, res) => quizController.getQuizzes(req, res))
// router.patch('/block/:id', authenticationMiddleware, (req, res) => lessonController.blockLesson(req, res))
// router.patch('/unblock/:id', authenticationMiddleware, (req, res) => lessonController.unblockLesson(req, res))
// router.get('/language/:languageId', authenticationMiddleware, (req, res) => lessonController.getLessonByLanguageId(req,res))
router.get('/:languageId/:categoryId', authenticationMiddleware, (req,res)=> quizController.getByLangugeAndCategory(req,res))
// router.get('/:lessonId' , authenticationMiddleware, (req,res) => lessonController.getLessonById(req,res))


export default router