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
class ChatService {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    getOrCreateChat(user1Id, user2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getOrCreateChat service')
            let chat = yield this.chatRepository.findChatByUsers(user1Id, user2Id);
            if (!chat) {
                chat = yield this.chatRepository.createChat(user1Id, user2Id);
                console.log('chat illa, create cheyyat');
            }
            else {
                console.log('object');
            }
            return chat;
        });
    }
    updateChatTimestamp(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.chatRepository.updateChatTimestamp(chatId);
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getUserChats imp')
            return this.chatRepository.getUserChats(userId);
        });
    }
}
exports.default = ChatService;
