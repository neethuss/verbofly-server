"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const quizController_1 = __importDefault(require("../../controllers/Admin/quizController"));
const quizService_1 = __importDefault(require("../../services/Admin/quizService"));
const quizRepositoryImplementation_1 = __importDefault(require("../../repositories/implementation/Admin/quizRepositoryImplementation"));
const quizRepositoryImplementation = new quizRepositoryImplementation_1.default();
const quizService = new quizService_1.default(quizRepositoryImplementation);
const quizController = new quizController_1.default(quizService);
const authenticationMiddleware_1 = __importDefault(require("../../middlewares/authenticationMiddleware"));
router.post('/addQuiz', authenticationMiddleware_1.default, (req, res) => quizController.postCreateQuiz(req, res));
router.get('/quizzes', authenticationMiddleware_1.default, (req, res) => quizController.getQuizzes(req, res));
// router.patch('/block/:id', authenticationMiddleware, (req, res) => lessonController.blockLesson(req, res))
// router.patch('/unblock/:id', authenticationMiddleware, (req, res) => lessonController.unblockLesson(req, res))
// router.get('/language/:languageId', authenticationMiddleware, (req, res) => lessonController.getLessonByLanguageId(req,res))
router.get('/:languageId/:categoryId', authenticationMiddleware_1.default, (req, res) => quizController.getByLangugeAndCategory(req, res));
// router.get('/:lessonId' , authenticationMiddleware, (req,res) => lessonController.getLessonById(req,res))
exports.default = router;
