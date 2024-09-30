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
const passwordUtils_1 = __importDefault(require("../../utils/passwordUtils"));
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield this.userRepository.createUser(user);
            return newUser;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(id);
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            return user;
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(user, 'servie');
            const updatedUser = yield this.userRepository.update(id, user);
            return updatedUser;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.delete(id);
        });
    }
    authenticateUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                return { user: null, message: "No user is registered with this email" };
            }
            if (user.isBlocked) {
                return { user: null, message: "Your account is blocked" };
            }
            const isPasswordMatch = yield passwordUtils_1.default.comparePassword(password, user.password);
            if (!isPasswordMatch) {
                return { user: null, message: "Invalid password" };
            }
            return { user: user, message: "User is authenticated" };
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepository.findAll(page, limit, search);
            return result;
        });
    }
    findNativeSpeakers(userId, page, limit, search, nativeLanguage, country) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.findNativeSpeakers(userId, page, limit, search, nativeLanguage, country);
        });
    }
    sendConnectionRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.sendRequests(senderId, receiverId);
        });
    }
    cancelConnectionRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.cancelRequests(senderId, receiverId);
        });
    }
    acceptConnectionRequest(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userRepository.acceptRequests(senderId, receiverId);
        });
    }
}
exports.default = UserService;
