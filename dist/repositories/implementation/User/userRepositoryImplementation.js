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
const userModel_1 = require("../../../models/User/userModel");
const languageModel_1 = require("../../../models/Admin/languageModel");
const countryModel_1 = require("../../../models/Admin/countryModel");
class UserRepositoryImplementation {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield userModel_1.User.create(user);
            return newUser;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.User.findById(id).populate('country', 'countryName')
                .populate('nativeLanguage', 'languageName')
                .populate('knownLanguages', 'languageName')
                .populate('languagesToLearn', 'languageName')
                .populate({
                path: 'receivedRequests',
                select: 'username email',
                populate: [
                    { path: 'country', select: 'countryName' },
                    { path: 'nativeLanguage', select: 'languageName' },
                ],
            })
                .populate({
                path: 'connections',
                select: 'username email',
                populate: [
                    { path: 'country', select: 'countryName' },
                    { path: 'nativeLanguage', select: 'languageName' },
                ],
            }).exec();
            return user;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('findbe email impl')
            const user = yield userModel_1.User.findOne({ email }).populate('country', 'countryName')
                .populate('nativeLanguage', 'languageName')
                .populate('knownLanguages', 'languageName')
                .populate('languagesToLearn', 'languageName')
                .populate({
                path: 'receivedRequests',
                select: 'username email',
                populate: [
                    { path: 'country', select: 'countryName' },
                    { path: 'nativeLanguage', select: 'languageName' },
                ],
            })
                .populate({
                path: 'connections',
                select: 'username email',
                populate: [
                    { path: 'country', select: 'countryName' },
                    { path: 'nativeLanguage', select: 'languageName' },
                ],
            })
                .exec();
            // console.log(user,'find by enal user return')
            return user;
        });
    }
    findAll(page, limit, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const query = search
                ? {
                    $or: [
                        { username: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                    ],
                }
                : {};
            const users = yield userModel_1.User.find(query).skip(offset).limit(limit).populate('country').populate('nativeLanguage').populate('knownLanguages').populate('languagesToLearn').exec();
            const total = yield userModel_1.User.countDocuments(query);
            return { users, total };
        });
    }
    update(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id, 'update id');
            console.log(user, 'update user');
            try {
                const updatedUser = yield userModel_1.User.findByIdAndUpdate(id, user, { new: true }).exec();
                console.log(updatedUser, 'update aayath');
                return updatedUser;
            }
            catch (error) {
                console.error('Error updating user:', error);
                return null;
            }
        });
    }
    findNativeSpeakers(userId, page, limit, search, nativeLanguage, country) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * limit;
            const nativeLanguageId = yield languageModel_1.Language.findOne({ languageName: nativeLanguage }).select('_id').exec();
            const countryId = yield countryModel_1.Country.findOne({ countryName: country }).select('_id').exec();
            const query = Object.assign(Object.assign(Object.assign({ _id: { $ne: userId } }, (search && {
                $or: [
                    { username: { $regex: search, $options: 'i' } },
                ],
            })), (nativeLanguageId && { nativeLanguage: nativeLanguageId._id })), (countryId && { country: countryId._id }));
            console.log("Query:", query);
            const users = yield userModel_1.User.find(query)
                .skip(offset)
                .limit(limit)
                .populate('country')
                .populate('nativeLanguage')
                .populate('knownLanguages')
                .populate('languagesToLearn')
                .exec();
            const total = yield userModel_1.User.countDocuments(query);
            console.log(total, users, 'baxk');
            return { users, total };
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield userModel_1.User.findByIdAndDelete(id).exec();
        });
    }
    sendRequests(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield userModel_1.User.findByIdAndUpdate(senderId, { $addToSet: { sentRequests: receiverId } }).exec();
            const receiver = yield userModel_1.User.findByIdAndUpdate(receiverId, { $addToSet: { receivedRequests: senderId } }).exec();
            console.log(sender, 'im[ se');
            console.log('re', receiver);
            return { sender, receiver };
        });
    }
    cancelRequests(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield userModel_1.User.findByIdAndUpdate(senderId, { $pull: { sentRequests: receiverId } }).exec();
            const receiver = yield userModel_1.User.findByIdAndUpdate(receiverId, { $pull: { receivedRequests: senderId } }).exec();
            console.log(sender, 'im[ se');
            console.log('re', receiver);
            return { sender, receiver };
        });
    }
    acceptRequests(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sender = yield userModel_1.User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } }).exec();
            const receiver = yield userModel_1.User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } }).exec();
            yield userModel_1.User.findByIdAndUpdate(receiverId, { $pull: { sentRequests: senderId } }, { new: true }).exec();
            yield userModel_1.User.findByIdAndUpdate(senderId, { $pull: { receivedRequests: receiverId } }, { new: true }).exec();
            console.log('jhashjhjshadsajhsjdhsjdh', sender, 'im[ se');
            console.log('re', receiver);
            return { sender, receiver };
        });
    }
}
exports.default = UserRepositoryImplementation;
