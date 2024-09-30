"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const languageController_1 = __importDefault(require("../../controllers/Admin/languageController"));
const languageService_1 = __importDefault(require("../../services/Admin/languageService"));
const languageRespositoryImplementation_1 = __importDefault(require("../../repositories/implementation/Admin/languageRespositoryImplementation"));
const languageRepositoryImplementation = new languageRespositoryImplementation_1.default();
const languageService = new languageService_1.default(languageRepositoryImplementation);
const languageController = new languageController_1.default(languageService);
const authenticationMiddleware_1 = __importDefault(require("../../middlewares/authenticationMiddleware"));
router.get('/languages', authenticationMiddleware_1.default, (req, res) => languageController.getLanguages(req, res));
router.patch('/block/:id', authenticationMiddleware_1.default, (req, res) => languageController.blockLanguage(req, res));
router.patch('/unblock/:id', authenticationMiddleware_1.default, (req, res) => languageController.blockLanguage(req, res));
exports.default = router;
