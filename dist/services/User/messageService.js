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
class MessageService {
    constructor(messageRepository) {
        this.messageRepository = messageRepository;
    }
    createMessage(chatId, senderId, messageText) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepository.createMessage(chatId, senderId, messageText);
        });
    }
    createImageMessage(chatId, senderId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepository.createImageMessage(chatId, senderId, image);
        });
    }
    createAudioMessage(chatId, senderId, audio) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepository.createAudioMessage(chatId, senderId, audio);
        });
    }
    createCallMessage(chatId, senderId, call) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.messageRepository.createCallMessage(chatId, senderId, call);
        });
    }
    getMessagesByChatId(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getMessagesByChatId, service')
            return this.messageRepository.getMessagesByChatId(chatId);
        });
    }
    markAsRead(chatId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('markAsRead service')
            return this.messageRepository.markAsRead(chatId, userId);
        });
    }
}
exports.default = MessageService;
