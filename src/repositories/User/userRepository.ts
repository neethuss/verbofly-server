import { IUser } from "../../models/User/userModel";

interface UserRepository{
  createUser(user : IUser) : Promise<IUser>;
  findById(id : string) : Promise<IUser | null>;
  findByEmail(email : string) : Promise<IUser | null>;
  findAll(page: number, limit: number, search: string): Promise<{ users: IUser[], total: number }>
  findNativeSpeakers(
    userId: string,
    page: number,
    limit: number,
    search: string,
    nativeLanguage?: string,
    country?: string
  ): Promise<{ users: IUser[], total: number }>;
  update(id : string, user : Partial<IUser>) : Promise<IUser | null>
  delete(id : string) : Promise<void>
  sendRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  cancelRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  rejectRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
  acceptRequests(senderId:string, receiverId:string) : Promise<{sender:IUser | null,receiver:IUser|null}>
}

export default UserRepository