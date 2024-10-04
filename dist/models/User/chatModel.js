"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
const ChatSchema = new mongoose_1.Schema({
    user1Id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    user2Id: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Chat = (0, mongoose_1.model)('Chat', ChatSchema);
exports.Chat = Chat;
