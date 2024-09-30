"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const categoryController_1 = __importDefault(require("../../controllers/Admin/categoryController"));
const categoryService_1 = __importDefault(require("../../services/Admin/categoryService"));
const categoryRepositotyImplementation_1 = __importDefault(require("../../repositories/implementation/Admin/categoryRepositotyImplementation"));
const categoryRepositotyImplementation = new categoryRepositotyImplementation_1.default();
const categoryService = new categoryService_1.default(categoryRepositotyImplementation);
const categoryController = new categoryController_1.default(categoryService);
const authenticationMiddleware_1 = __importDefault(require("../../middlewares/authenticationMiddleware"));
router.get('/categories', authenticationMiddleware_1.default, (req, res) => categoryController.getCategories(req, res));
router.patch('/block/:id', authenticationMiddleware_1.default, (req, res) => categoryController.blockCategory(req, res));
router.patch('/unblock/:id', authenticationMiddleware_1.default, (req, res) => categoryController.unblockCategory(req, res));
exports.default = router;
