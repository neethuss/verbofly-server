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
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class mailUtils {
    static sendOtp(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('send');
            const transporter = nodemailer_1.default.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.OTP_SENDER_EMAIL,
                    pass: process.env.OTP_SENDER_PASSWORD,
                },
            });
            const mailOptions = {
                from: process.env.OTP_SENDER_EMAIL,
                to: email,
                subject: 'Hello, This is from TalkTrek,',
                text: `Your OTP for password reset is: ${otp}`,
            };
            try {
                yield transporter.sendMail(mailOptions);
                console.log('OTP email sent successfully');
                return { email, otp, message: 'OTP sent successfully' };
            }
            catch (error) {
                console.error('Error sending OTP email:', error);
                throw new Error('Failed to send OTP email');
            }
        });
    }
}
exports.default = mailUtils;