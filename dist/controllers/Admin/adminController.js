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
const jwtUtils_1 = __importDefault(require("../../utils/jwtUtils"));
class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    postLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('backend vann');
                const { email, password } = req.body;
                const isAdmin = yield this.adminService.findByEmail(email);
                console.log('exist', isAdmin);
                if (isAdmin) {
                    const isPassword = (yield password) === isAdmin.password;
                    if (isPassword) {
                        const accessToken = jwtUtils_1.default.generateAccessToken({ email: isAdmin.email });
                        const refreshToken = jwtUtils_1.default.generateRefreshToken({ email: isAdmin.email });
                        res.cookie("adminRefreshToken", refreshToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'none',
                            maxAge: 7 * 24 * 60 * 60 * 1000
                        });
                        console.log('succ');
                        res.status(200).json({ message: 'Login successful', accessToken, isAdmin });
                    }
                    else {
                        res.status(401).json({ message: 'Incorrect password' });
                    }
                }
                else {
                    res.status(401).json({ message: 'Email is incorrect' });
                }
            }
            catch (error) {
                let errorMessage = 'An unexpected error occurred';
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                res.status(500).json({ message: errorMessage });
            }
        });
    }
}
exports.default = AdminController;
