import { IUser } from "../../models/User/userModel";
import PasswordUtils from "../../utils/passwordUtils";
import ConnectionRepository from "../../repositories/User/connectionRepository";

class ConnectionService {
  private connectionRepository: ConnectionRepository

  constructor(connectionRepository: ConnectionRepository) {
    this.connectionRepository = connectionRepository
  }


  async sendConnectionRequest(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    return this.connectionRepository.sendRequests(senderId, receiverId);
  }

  async cancelConnectionRequest(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    return this.connectionRepository.cancelRequests(senderId, receiverId);
  }

  async rejectConnectionRequest(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    return this.connectionRepository.rejectRequests(senderId, receiverId);
  }

  async acceptConnectionRequest(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    return this.connectionRepository.acceptRequests(senderId, receiverId);
  }


  async findNativeSpeakers(
    userId: string,
    page: number,
    limit: number,
    search: string,
    nativeLanguage?: string,
    country?: string
  ): Promise<{ users: IUser[], total: number }> {
    return this.connectionRepository.findNativeSpeakers(
      userId,
      page,
      limit,
      search,
      nativeLanguage,
      country
    );
  }
  

}

export default ConnectionService