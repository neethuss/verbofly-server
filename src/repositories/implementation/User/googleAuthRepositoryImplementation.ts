import { User, IUser } from '../../../models/User/userModel'
import GoogleAuthRepository from '../../User/googleAuthRepository'

class GoogleAuthRepositoryImplementation implements GoogleAuthRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }
  
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return await user.save(); 
  }
}

export default GoogleAuthRepositoryImplementation