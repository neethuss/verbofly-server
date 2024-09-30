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
const UserModel_1 = require("../../models/UserModel");
class UserRepositoryImplementation {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield UserModel_1.User.create(user);
            return newUser;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.User.findById(id).exec();
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel_1.User.findOne({ email }).exec();
            return user;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield UserModel_1.User.find().exec();
            return users;
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield UserModel_1.User.findByIdAndUpdate(id, user).exec();
            return updatedUser;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield UserModel_1.User.findByIdAndDelete(id).exec();
        });
    }
}
exports.default = UserRepositoryImplementation;
