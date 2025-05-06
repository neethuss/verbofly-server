import { SignupDTO } from "../../interface/User/userDto";
import { IUser } from "../../models/User/userModel";

interface UserRepository{
  createUser(user : SignupDTO) : Promise<IUser>;
  findById(id : string) : Promise<IUser | null>;
  findByEmail(email : string) : Promise<IUser | null>;
  findAll(page: number, limit: number, search: string): Promise<{ users: IUser[], total: number }>
 
  update(id : string, user : Partial<IUser>) : Promise<IUser | null>
  deleteUser(id : string) : Promise<void>
 
}

export default UserRepository