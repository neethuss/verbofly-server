import UserRepository from "../../repositories/User/userRepository";
import { IUser } from "../../models/User/userModel";
import PasswordUtils from "../../utils/passwordUtils";

class UserService{
  private userRepository : UserRepository

  constructor(userRepository : UserRepository){
    this.userRepository = userRepository
  }

  async createUser(user : IUser) : Promise<IUser>{
    const newUser = await this.userRepository.createUser(user)
    return newUser
  }

async findById(id : string) : Promise<IUser | null>{
  const user = await this.userRepository.findById(id)
  return user
}

async findByEmail(email : string) : Promise<IUser | null>{
  const user = await this.userRepository.findByEmail(email)
  return user
}


async update(id : string, user : Partial<IUser>) : Promise<IUser | null>{
  console.log(user,'servie')
  const updatedUser = await this.userRepository.update(id, user)
  return updatedUser
}

async delete(id : string) : Promise<void>{
  await this.userRepository.delete(id)
}

async authenticateUser(email : string , password : string) : Promise<{user : IUser | null , message : string}>{
  const user = await this.userRepository.findByEmail(email)
  if(!user){
    return {user : null , message : "No user is registered with this email"}
  }

  if(user.isBlocked){
    return {user : null , message : "Your account is blocked"}
  }

  const isPasswordMatch = await PasswordUtils.comparePassword(password, user.password)
  if(!isPasswordMatch){
    return {user : null, message : "Invalid password"}
  }

  return { user : user , message : "User is authenticated"}
}

async findAll(page: number, limit: number, search: string): Promise<{ users: IUser[], total: number }> {
  const result = await this.userRepository.findAll(page, limit, search);
  return result;
}

async findNativeSpeakers(
  userId: string,
  page: number,
  limit: number,
  search: string,
  nativeLanguage?: string,
  country?: string
): Promise<{ users: IUser[], total: number }> {
  return this.userRepository.findNativeSpeakers(
    userId,
    page,
    limit,
    search,
    nativeLanguage,
    country
  );
}


async sendConnectionRequest(senderId: string, receiverId: string): Promise<{sender:IUser | null,receiver:IUser|null}> {
  return this.userRepository.sendRequests(senderId, receiverId);
}

async cancelConnectionRequest(senderId: string, receiverId: string): Promise<{sender:IUser | null,receiver:IUser|null}> {
  return this.userRepository.cancelRequests(senderId, receiverId);
}

async rejectConnectionRequest(senderId: string, receiverId: string): Promise<{sender:IUser | null,receiver:IUser|null}> {
  return this.userRepository.rejectRequests(senderId, receiverId);
}

async acceptConnectionRequest(senderId: string, receiverId: string): Promise<{sender:IUser | null,receiver:IUser|null}> {
  return this.userRepository.acceptRequests(senderId, receiverId);
}




}

export default UserService