import ChatRepository from '../../repositories/User/chatRepository';
import { IChat } from '../../models/User/chatModel';
import { Types } from 'mongoose';

class ChatService {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  async getOrCreateChat(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat> {
    // console.log('getOrCreateChat service')
    let chat = await this.chatRepository.findChatByUsers(user1Id, user2Id);
    if (!chat) {
      chat = await this.chatRepository.createChat(user1Id, user2Id);
      console.log('chat illa, create cheyyat')
    }else{
      console.log('object')
    }
    return chat;
  }

  async updateChatTimestamp(chatId: Types.ObjectId): Promise<void> {
    await this.chatRepository.updateChatTimestamp(chatId);
  }

  async getUserChats(userId: Types.ObjectId): Promise<IChat[]> {
    // console.log('getUserChats imp')
    return this.chatRepository.getUserChats(userId);
  }
}

export default ChatService;