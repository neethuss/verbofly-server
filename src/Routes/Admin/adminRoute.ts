import { Router } from "express";

import AdminController from "../../controllers/Admin/adminController";
import AdminService from "../../services/Admin/adminService";
import AdminRepositoryImplementation from "../../repositories/implementation/Admin/adminRepositoryImplementation";

const adminRepositoryImplementation = new AdminRepositoryImplementation()
const adminService = new AdminService(adminRepositoryImplementation)
const adminController = new AdminController(adminService)

import LessonController from "../../controllers/Admin/lessonController";
import LessonService from "../../services/Admin/lessonService";
import LessonRepositoryImplementation from "../../repositories/implementation/Admin/lessonRepositoryImplementation";

const lessonRepositoryImplementation = new LessonRepositoryImplementation()
const lessonService = new LessonService(lessonRepositoryImplementation)
const lessonController = new LessonController(lessonService)

const router = Router()

router.post('/',(req,res) => adminController.postLogin(req,res))


export default router