import UserRepository from "../../repositories/User/userRepository";
import { IUser } from "../../models/User/userModel";

class UserManagementService{
  private userRepository : UserRepository

  constructor(userRepository : UserRepository){
    this.userRepository = userRepository
  }

  async findAll(page: number, limit: number, search: string): Promise<{ users: IUser[], total: number }> {
    const result = await this.userRepository.findAll(page, limit, search);
    return result;
  }

async update(id : string, user : Partial<IUser>) : Promise<IUser | null>{
  const updatedUser = await this.userRepository.update(id, user)
  return updatedUser
}


}

export default UserManagementService