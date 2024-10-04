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
const chatModel_1 = require("../../../models/User/chatModel");
class ChatRepositoryImplementation {
    createChat(user1Id, user2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('createChat imp');
            console.log('creating');
            const newChat = yield chatModel_1.Chat.create({ user1Id, user2Id });
            return newChat.toObject();
        });
    }
    findChatByUsers(user1Id, user2Id) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('findChatByUsers, impl');
            const chat = yield chatModel_1.Chat.findOne({
                $or: [
                    { user1Id, user2Id },
                    { user1Id: user2Id, user2Id: user1Id }
                ]
            });
            // console.log(chat, 'find chat');
            return chat ? chat.toObject() : null;
        });
    }
    updateChatTimestamp(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield chatModel_1.Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
        });
    }
    getUserChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getUserChats, impl');
            const chats = yield chatModel_1.Chat.aggregate([
                {
                    $match: {
                        $or: [
                            { user1Id: userId },
                            { user2Id: userId }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'messages',
                        let: { chatId: '$_id' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$chatId', '$$chatId'] } } },
                            { $sort: { createdAt: -1 } },
                            { $limit: 1 }
                        ],
                        as: 'lastMessage'
                    }
                },
                {
                    $unwind: {
                        path: '$lastMessage',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'messages',
                        let: { chatId: '$_id', userId: userId },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ['$chatId', '$$chatId'] },
                                            { $eq: ['$readAt', null] },
                                            { $ne: ['$senderId', '$$userId'] }
                                        ]
                                    }
                                }
                            },
                            { $count: 'unreadCount' }
                        ],
                        as: 'unreadMessages'
                    }
                },
                {
                    $unwind: {
                        path: '$unreadMessages',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        let: {
                            otherUserId: {
                                $cond: {
                                    if: { $eq: ['$user1Id', userId] },
                                    then: '$user2Id',
                                    else: '$user1Id'
                                }
                            }
                        },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', '$$otherUserId'] } } }
                        ],
                        as: 'otherUser'
                    }
                },
                {
                    $unwind: '$otherUser'
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { senderId: '$lastMessage.senderId' },
                        pipeline: [
                            { $match: { $expr: { $eq: ['$_id', '$$senderId'] } } },
                            { $project: { username: 1 } }
                        ],
                        as: 'sender'
                    }
                },
                {
                    $unwind: {
                        path: '$sender',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        _id: 1,
                        otherUser: {
                            _id: 1,
                            username: 1,
                            email: 1,
                            profilePhoto: 1,
                            bio: 1
                        },
                        lastMessage: {
                            _id: '$lastMessage._id',
                            messageText: '$lastMessage.messageText',
                            createdAt: '$lastMessage.createdAt',
                            senderId: '$lastMessage.senderId',
                            senderName: '$sender.username',
                            image: '$lastMessage.image',
                            audio: '$lastMessage.audio'
                        },
                        unreadMessages: {
                            $ifNull: ['$unreadMessages.unreadCount', 0]
                        }
                    }
                },
                {
                    $sort: { 'lastMessage.createdAt': 1 }
                }
            ]);
            // console.log(chats, 'user chats');
            return chats;
        });
    }
}
exports.default = ChatRepositoryImplementation;
