import { Router } from "express";

const router = Router()

import LessonController from "../../controllers/Admin/lessonController";
import LessonService from "../../services/Admin/lessonService";
import LessonRepositoryImplementation from "../../repositories/implementation/Admin/lessonRepositoryImplementation";

const lessonRepositoryImplementation = new LessonRepositoryImplementation()
const lessonService = new LessonService(lessonRepositoryImplementation)
const lessonController = new LessonController(lessonService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import upload from "../../middlewares/uploadMiddleware";

router.post('/addLesson',authenticationMiddleware, upload.single('file'), (req,res) => lessonController.postCreateLesson(req,res))
router.get('/lessons', authenticationMiddleware, (req, res) => lessonController.getLessons(req, res))
router.patch('/block/:id', authenticationMiddleware, (req, res) => lessonController.blockLesson(req, res))
router.patch('/unblock/:id', authenticationMiddleware, (req, res) => lessonController.unblockLesson(req, res))
router.get('/language/:languageId', authenticationMiddleware, (req, res) => lessonController.getLessonByLanguageId(req,res))
router.get('/:languageId/:categoryId', authenticationMiddleware, (req,res)=> lessonController.getCategoryLessons(req,res))
router.get('/:lessonId' , authenticationMiddleware, (req,res) => lessonController.getLessonById(req,res))
router.patch('/:lessonId',authenticationMiddleware, (req, res) => lessonController.editLessonById(req,res))


export default router