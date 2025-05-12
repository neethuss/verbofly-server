import { Router } from "express";

const router = Router()

import CategoryController from "../../controllers/Admin/categoryController";
import CategoryService from "../../services/Admin/categoryService";
import CategoryRepositoryImplementation from "../../repositories/implementation/Admin/categoryRepositotyImplementation";

const categoryRepositotyImplementation = new CategoryRepositoryImplementation()
const categoryService = new CategoryService(categoryRepositotyImplementation)
const categoryController = new CategoryController(categoryService)

import authenticationMiddleware from "../../middlewares/authenticationMiddleware";
import authorizationMiddleware from "../../middlewares/authorizationMiddleware";

router.post('/addCategory',authenticationMiddleware, (req,res)=> categoryController.postCreateCategory(req,res))
router.get('/categories', authenticationMiddleware, (req,res) => categoryController.getCategories(req,res))
router.get('/:id', authenticationMiddleware, (req,res) => categoryController.getCategory(req,res))
router.patch('/:id', authenticationMiddleware,(req, res)=> categoryController.updateCategory(req,res))
router.get('/categories', authenticationMiddleware, authorizationMiddleware,(req, res) => categoryController.getCategories(req, res))
router.patch('/block/:id', authenticationMiddleware, (req, res) => categoryController.blockCategory(req, res))
router.patch('/unblock/:id', authenticationMiddleware,(req, res) => categoryController.unblockCategory(req,res))

export default router
