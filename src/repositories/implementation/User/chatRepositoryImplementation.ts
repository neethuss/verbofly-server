import { Chat, IChat } from '../../../models/User/chatModel';
import ChatRepository from '../../User/chatRepository';
import { Types } from 'mongoose';


class ChatRepositoryImplementation implements ChatRepository {
  async createChat(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat> {
    console.log('createChat imp');
    console.log('creating');
    const newChat = await Chat.create({ user1Id, user2Id });
    return newChat.toObject() as IChat;
  }

  async findChatByUsers(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat | null> {
    // console.log('findChatByUsers, impl');
    const chat = await Chat.findOne({
      $or: [
        { user1Id, user2Id },
        { user1Id: user2Id, user2Id: user1Id }
      ]
    });
    // console.log(chat, 'find chat');
    return chat ? (chat.toObject() as IChat) : null;
  }

  async updateChatTimestamp(chatId: Types.ObjectId): Promise<void> {
    await Chat.findByIdAndUpdate(chatId, { updatedAt: new Date() });
  }

  async getUserChats(userId: Types.ObjectId): Promise<IChat[]> {
    // console.log('getUserChats, impl');

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
            image:'$lastMessage.image',
            audio:'$lastMessage.audio'
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
  }



}

export default ChatRepositoryImplementation;
