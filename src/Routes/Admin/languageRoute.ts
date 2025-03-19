import { Router } from "express";

const router = Router()

import LanguageController from "../../controllers/Admin/languageController";
import LanguageService from "../../services/Admin/languageService";
import LanguageRepositoryImplementation from "../../repositories/implementation/Admin/languageRespositoryImplementation";


const languageRepositoryImplementation = new LanguageRepositoryImplementation()
const languageService = new LanguageService(languageRepositoryImplementation)
const languageController = new LanguageController(languageService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import isBlockedMiddleware from "../../middlewares/isBlockedMiddleware";


router.get('/languages', authenticationMiddleware, (req, res) => languageController.getLanguages(req,res))
router.post('/addLanguage', authenticationMiddleware, (req, res) => languageController.postLanguage(req,res))
router.get('/:id', authenticationMiddleware, (req,res)=> languageController.getLanguage(req,res))
router.patch('/:id', authenticationMiddleware,(req,res) => languageController.updateLanguage(req,res))
router.patch('/block/:id', authenticationMiddleware, (req, res) => languageController.blockLanguage(req,res))
router.patch('/unblock/:id', authenticationMiddleware, (req, res) => languageController.blockLanguage(req,res))


export default router