"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/User/userService"));
const userRepositoryImplementation_1 = __importDefault(require("../repositories/implementation/User/userRepositoryImplementation"));
const userRepositoryImplementation = new userRepositoryImplementation_1.default();
const userService = new userService_1.default(userRepositoryImplementation);
const isBlockedMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.user;
        const user = yield userService.findByEmail(email);
        if (user === null || user === void 0 ? void 0 : user.isBlocked) {
            res.status(403).json({ message: "Your account is blocked" });
            return;
        }
        else {
            next();
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error while checking user is blocked or not' });
    }
});
exports.default = isBlockedMiddleware;
