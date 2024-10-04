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
const messageModel_1 = require("../../../models/User/messageModel");
class MessageRepositoryImplementation {
    createMessage(chatId, senderId, messageText) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('createMessage impl')
            const newMessage = yield messageModel_1.Message.create({ chatId, senderId, messageText });
            return newMessage;
        });
    }
    createImageMessage(chatId, senderId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('createMessage impl')
            const newMessage = yield messageModel_1.Message.create({ chatId, senderId, image });
            return newMessage;
        });
    }
    createAudioMessage(chatId, senderId, audio) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('createMessage impl')
            const newMessage = yield messageModel_1.Message.create({ chatId, senderId, audio });
            return newMessage;
        });
    }
    createCallMessage(chatId, senderId, call) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('createMessage impl')
            const newMessage = yield messageModel_1.Message.create({ chatId, senderId, call });
            return newMessage;
        });
    }
    getMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getMessagesByChatId imple')
            const messages = yield messageModel_1.Message.find({ chatId }).sort({ createdAt: 1 });
            // console.log(messages,'messages')
            return messages;
        });
    }
    markAsRead(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield messageModel_1.Message.updateMany({
                chatId,
                senderId: userId,
                readAt: null
            }, {
                $set: {
                    readAt: new Date(),
                }
            });
            // console.log(update,'update')
            const allMessages = yield messageModel_1.Message.find({ chatId });
            // console.log(allMessages,'all')
            return allMessages;
        });
    }
}
exports.default = MessageRepositoryImplementation;
