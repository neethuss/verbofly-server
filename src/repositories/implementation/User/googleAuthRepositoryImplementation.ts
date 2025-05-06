
import { IUser, User } from '../../../models/User/userModel';
import GoogleAuthRepository from '../../User/googleAuthRepository';
import { BaseRepositoryImplentation } from '../Base/baseRepositoryImplementation';


class GoogleAuthRepositoryImplementation
  extends BaseRepositoryImplentation<IUser>
  implements GoogleAuthRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.create(userData);
  }
}

export default GoogleAuthRepositoryImplementation;
