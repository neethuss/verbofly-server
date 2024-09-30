import { IChat } from '../../models/User/chatModel';
import { Types } from 'mongoose';

interface ChatRepository {
  createChat(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat>;
  findChatByUsers(user1Id: Types.ObjectId, user2Id: Types.ObjectId): Promise<IChat | null>;
  updateChatTimestamp(chatId: Types.ObjectId): Promise<void>;
  getUserChats(userId:Types.ObjectId):Promise<IChat[]>
}

export default ChatRepository;