import { Router } from "express";

const router = Router()

import QuizController from "../../controllers/Admin/quizController";
import QuizService from "../../services/Admin/quizService";
import QuizRepositoryImplementation from "../../repositories/implementation/Admin/quizRepositoryImplementation";
const quizRepositoryImplementation = new QuizRepositoryImplementation()
const quizService = new QuizService(quizRepositoryImplementation)
const quizController = new QuizController(quizService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";

router.post('/addQuiz',authenticationMiddleware,  (req,res) => quizController.postCreateQuiz(req,res))
router.get('/quizzes', authenticationMiddleware, (req, res) => quizController.getQuizzes(req, res))

router.get('/:quizId' , authenticationMiddleware, (req,res) => quizController.getQuizById(req,res))

router.patch('/:quizId',authenticationMiddleware,  (req,res) => quizController.editQuiz(req,res))

router.get('/:languageId/:categoryId', authenticationMiddleware, (req,res)=> quizController.getByLangugeAndCategory(req,res))


export default router