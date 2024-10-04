"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const subscriptionController_1 = __importDefault(require("../../controllers/Admin/subscriptionController"));
const subscriptonService_1 = __importDefault(require("../../services/Admin/subscriptonService"));
const subscriptionRepositoryImplementation_1 = __importDefault(require("../../repositories/implementation/Admin/subscriptionRepositoryImplementation"));
const subscriptionRepositoryImplementation = new subscriptionRepositoryImplementation_1.default();
const subscriptionService = new subscriptonService_1.default(subscriptionRepositoryImplementation);
const subscriptionController = new subscriptionController_1.default(subscriptionService);
const authenticationMiddleware_1 = __importDefault(require("../../middlewares/authenticationMiddleware"));
router.get('/languages', authenticationMiddleware_1.default, (req, res) => subscriptionController.getSubscriptions(req, res));
exports.default = router;
