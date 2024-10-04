"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const mongoose_1 = require("mongoose");
const MessageSchema = new mongoose_1.Schema({
    chatId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Chat', required: true },
    senderId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    messageText: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    readAt: { type: Date, default: null },
    image: { type: String, required: false },
    audio: { type: String, required: false },
    call: { type: Boolean, required: false, default: false }
});
const Message = (0, mongoose_1.model)('Message', MessageSchema);
exports.Message = Message;
