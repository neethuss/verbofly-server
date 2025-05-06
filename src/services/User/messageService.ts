import MessageRepository from '../../repositories/User/messageRepository';
import { IMessage } from '../../models/User/messageModel';
import { Types } from 'mongoose';

class MessageService {
  private messageRepository: MessageRepository;

  constructor(messageRepository: MessageRepository) {
    this.messageRepository = messageRepository;
  }

  async createMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, messageText: string): Promise<IMessage> {
    return this.messageRepository.createMessage(chatId, senderId, messageText);
  }

  async createImageMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, image: string): Promise<IMessage> {
    return this.messageRepository.createImageMessage(chatId, senderId, image);
  }

  async createAudioMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, audio: string): Promise<IMessage> {
    return this.messageRepository.createAudioMessage(chatId, senderId, audio);
  }

  async createCallMessage(chatId: Types.ObjectId, senderId: Types.ObjectId, call: boolean): Promise<IMessage> {
    return this.messageRepository.createCallMessage(chatId, senderId, call);
  }

  async getMessagesByChatId(chatId: Types.ObjectId): Promise<IMessage[]> {
    return this.messageRepository.getMessagesByChatId(chatId);
  }

  async markAsRead(chatId:Types.ObjectId, userId:Types.ObjectId):Promise<IMessage[]>{
    return this.messageRepository.markAsRead(chatId, userId)
  }

}

export default MessageService;