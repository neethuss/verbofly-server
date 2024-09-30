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
Object.defineProperty(exports, "__esModule", { value: true });
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
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield this.userRepository.findAll();
            return users;
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield this.userRepository.update(id, user);
            return updatedUser;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.userRepository.delete(id);
        });
    }
}
exports.default = UserService;
