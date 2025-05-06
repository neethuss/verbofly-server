import { IChat } from '../../../models/User/chatModel';
import ChatRepository from '../../User/chatRepository';
import { Types } from 'mongoose';
import { BaseRepositoryImplentation } from '../../implementation/Base/baseRepositoryImplementation'
import { Model } from "mongoose";
import { Chat } from '../../../models/User/chatModel';

class ChatRepositoryImplementation extends BaseRepositoryImplentation<IChat> implements ChatRepository {
  constructor() {
    super(Chat); 
  }

  async createChat(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat> {
    const newChat = await this.create({ user1Id, user2Id });
    return newChat;
  }

  async findChatByUsers(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat | null> {
    const chat = await this.findOne({
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id }
      ]
    });
    return chat;
  }

  async updateChatTimestamp(chatId: Types.ObjectId): Promise<void> {
    await this.update(chatId.toString(), { updatedAt: new Date() });
  }

  async getUserChats(userId: Types.ObjectId): Promise<IChat[]> {
    const chats = await Chat.aggregate([
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

    return chats;
  }
}

export default ChatRepositoryImplementation;
