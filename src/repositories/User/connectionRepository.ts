import { IUser } from "../../models/User/userModel";

interface ConnectionRepository{
  sendRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  cancelRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  rejectRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  acceptRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  findNativeSpeakers(
    userId: string,
    page: number,
    limit: number,
    search: string,
    nativeLanguage?: string,
    country?: string
  ): Promise<{ users: IUser[], total: number }>;
}

export default ConnectionRepository