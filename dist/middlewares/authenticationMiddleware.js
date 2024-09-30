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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticationMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log('Middleware started');
        const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        console.log(token, 'token backend');
        if (!token) {
            throw new Error('Authentication failed. Token missing.');
        }
        console.log('Token:', token);
        const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;
        if (!accessSecret) {
            throw new Error('JWT secret key is not set in environment variables.');
        }
        const decoded = jsonwebtoken_1.default.verify(token, accessSecret);
        console.log('Decoded email:', decoded.email);
        req.user = decoded.email;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).send({ error: 'Token expired. Please refresh your token.' });
        }
        else if (error instanceof Error) {
            console.error('Error in authenticationMiddleware:', error.message);
            res.status(401).send({ error: 'Authentication failed.' });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).send({ error: 'An unexpected error occurred.' });
        }
    }
});
exports.default = authenticationMiddleware;
