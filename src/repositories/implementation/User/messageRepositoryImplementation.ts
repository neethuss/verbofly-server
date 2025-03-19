import { Message, IMessage } from '../../../models/User/messageModel';
import MessageRepository from '../../User/messageRepository';
import { Types } from 'mongoose';

class MessageRepositoryImplementation implements MessageRepository {
  async createMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, messageText: string): Promise<IMessage> {
    // console.log('createMessage impl')
    const newMessage = await Message.create({ chatId, senderId, messageText });
    return newMessage;
  }

  async createImageMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, image: string): Promise<IMessage> {
    // console.log('createMessage impl')
    const newMessage = await Message.create({ chatId, senderId, image });
    return newMessage;
  }

  async createAudioMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, audio: string): Promise<IMessage> {
    // console.log('createMessage impl')
    const newMessage = await Message.create({ chatId, senderId, audio });
    return newMessage;
  }

  async createCallMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, call: boolean): Promise<IMessage> {
    // console.log('createMessage impl')
    const newMessage = await Message.create({ chatId, senderId, call });
    return newMessage;
  }



  async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
    // console.log('getMessagesByChatId imple')
    const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
    // console.log(messages,'messages')
    return messages;
  }

  async markAsRead(chatId: Types.ObjectId, userId: Types.ObjectId): Promise<IMessage[]> {
      const update =   await Message.updateMany(
      {
        chatId,
        senderId: userId,
        readAt: null
      },
      { 
        $set: { 
          readAt: new Date(),
        }
      }
    );
    // console.log(update,'update')
    const allMessages = await Message.find({ chatId });
  // console.log(allMessages,'all')
  
    return allMessages;
  }
  
}

export default MessageRepositoryImplementation;