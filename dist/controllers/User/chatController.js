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
const mongodb_1 = require("mongodb");
class ChatController {
    constructor(chatService, messageService) {
        this.chatService = chatService;
        this.messageService = messageService;
    }
    getOrCreateChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('getOrCreatechat')
                const { user1Id, user2Id } = req.params;
                // console.log(user1Id, user2Id,'para')
                const user1ObjectId = new mongodb_1.ObjectId(user1Id);
                const user2ObjectId = new mongodb_1.ObjectId(user2Id);
                // console.log(user1ObjectId, user2ObjectId,'obj')
                const chat = yield this.chatService.getOrCreateChat(user1ObjectId, user2ObjectId);
                res.status(200).json(chat);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching or creating chat' });
            }
        });
    }
    getChatMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('getChatMessages')
                const { chatId } = req.params;
                // console.log(chatId,'chatId')
                const chatObjectId = new mongodb_1.ObjectId(chatId);
                const messages = yield this.messageService.getMessagesByChatId(chatObjectId);
                res.status(200).json(messages);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching messages' });
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, messageText } = req.body;
                if (!messageText || messageText.trim() === "") {
                    res.status(400).json({ message: "Message text cannot be empty" });
                    return;
                }
                const newMessage = yield this.messageService.createMessage(chatId, senderId, messageText);
                yield this.chatService.updateChatTimestamp(chatId);
                res.status(201).json(newMessage);
            }
            catch (error) {
                res.status(500).json({ message: "Error sending message" });
            }
        });
    }
    saveImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, fileUrl } = req.body;
                console.log(fileUrl, 'file url back');
                if (fileUrl) {
                    const newMessage = yield this.messageService.createImageMessage(chatId, senderId, fileUrl);
                    yield this.chatService.updateChatTimestamp(chatId);
                    res.status(201).json(newMessage);
                }
                else {
                    res.status(400).json({ message: "Image URL is invalid" });
                }
            }
            catch (error) {
                console.error('Error in sendImage:', error);
                res.status(500).json({ message: "Error sending image", error });
            }
        });
    }
    saveAudio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, fileUrl } = req.body;
                console.log(fileUrl, 'file url back');
                if (fileUrl) {
                    const newMessage = yield this.messageService.createAudioMessage(chatId, senderId, fileUrl);
                    yield this.chatService.updateChatTimestamp(chatId);
                    res.status(201).json(newMessage);
                }
                else {
                    res.status(400).json({ message: "Image URL is invalid" });
                }
            }
            catch (error) {
                console.error('Error in sendImage:', error);
                res.status(500).json({ message: "Error sending audio", error });
            }
        });
    }
    saveCall(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { chatId, senderId, call } = req.body;
                if (call) {
                    const newMessage = yield this.messageService.createCallMessage(chatId, senderId, call);
                    yield this.chatService.updateChatTimestamp(chatId);
                    res.status(201).json(newMessage);
                }
                else {
                    res.status(400).json({ message: "Image URL is invalid" });
                }
            }
            catch (error) {
                console.error('Error in sendImage:', error);
                res.status(500).json({ message: "Error sending audio", error });
            }
        });
    }
    sendImage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.file) {
                    res.status(400).json({ message: "No file uploaded" });
                    return;
                }
                const { chatId, senderId } = req.body;
                const fileUrl = req.file.location;
                console.log('File URL:', fileUrl);
                console.log('Chat ID:', chatId, 'Sender ID:', senderId);
                if (fileUrl) {
                    res.status(201).json(fileUrl);
                }
                else {
                    res.status(400).json({ message: "Image URL is invalid" });
                }
            }
            catch (error) {
                console.error('Error in sendImage:', error);
                res.status(500).json({ message: "Error sending image", error });
            }
        });
    }
    getUserChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getUserChats')
            try {
                const { userId } = req.params;
                const userObjectId = new mongodb_1.ObjectId(userId);
                const chats = yield this.chatService.getUserChats(userObjectId);
                // console.log(chats,'getUserChats controller return' )
                res.status(200).json(chats);
            }
            catch (error) {
                res.status(500).json({ message: 'Error fetching user chats' });
            }
        });
    }
    markAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log('marking as read')
                const { chatId, userId } = req.body;
                try {
                    const messages = yield this.messageService.markAsRead(chatId, userId);
                    res.status(200).json(messages);
                }
                catch (error) {
                    res.status(500).json({ message: 'Error fetching user chats' });
                }
            }
            catch (error) {
            }
        });
    }
}
exports.default = ChatController;
