import { IUser } from "../../models/User/userModel";


interface GoogleAuthRepository{
  createUser(user : IUser) : Promise<IUser>;
  findByEmail(email : string) : Promise<IUser | null>;
}


export default  GoogleAuthRepository
