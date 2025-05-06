import { Types } from 'mongoose';
import { Message, IMessage } from '../../../models/User/messageModel';
import { BaseRepositoryImplentation } from '../Base/baseRepositoryImplementation';
import MessageRepository from '../../User/messageRepository';

class MessageRepositoryImplementation extends BaseRepositoryImplentation<IMessage> implements MessageRepository {
  constructor() {
    super(Message); 
  }

  async createMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, messageText: string): Promise<IMessage> {
    return this.create({ chatId, senderId, messageText } as Partial<IMessage>);
  }

  async createImageMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, image: string): Promise<IMessage> {
    return this.create({ chatId, senderId, image } as Partial<IMessage>);
  }

  async createAudioMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, audio: string): Promise<IMessage> {
    return this.create({ chatId, senderId, audio } as Partial<IMessage>);
  }

  async createCallMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, call: boolean): Promise<IMessage> {
    return this.create({ chatId, senderId, call } as Partial<IMessage>);
  }

  async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
    return this.find({ chatId }, { sort: { createdAt: 1 } });
  }

  async markAsRead(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<IMessage[]> {
    await Message.updateMany(
      {
        chatId,
        senderId: userId,
        readAt: null
      },
      { $set: { readAt: new Date() } }
    );

    return this.find({ chatId });
  }
}

export default MessageRepositoryImplementation;
