import { User, IUser } from '../../../models/User/userModel';
import { BaseRepositoryImplentation } from '../Base/baseRepositoryImplementation';
import UserRepository from '../../User/userRepository';
import { SignupDTO } from '../../../interface/User/userDto';

class UserRepositoryImplementation extends BaseRepositoryImplentation<IUser> implements UserRepository {
  constructor() {
    super(User);
  }

  async createUser(user: SignupDTO): Promise<IUser> {
    return this.create(user);
  }

  async findById(id: string): Promise<IUser | null> {
    return this.model.findById(id)
      .populate('country', 'countryName')
      .populate('nativeLanguage', 'languageName')
      .populate('knownLanguages', 'languageName')
      .populate('languagesToLearn', 'languageName')
      .populate({
        path: 'receivedRequests',
        select: 'username email',
        populate: [
          { path: 'country', select: 'countryName' },
          { path: 'nativeLanguage', select: 'languageName' },
        ],
      })
      .populate({
        path: 'sentRequests',
        select: 'username email',
        populate: [
          { path: 'country', select: 'countryName' },
          { path: 'nativeLanguage', select: 'languageName' },
        ],
      })
      .populate({
        path: 'connections',
        select: 'username email',
        populate: [
          { path: 'country', select: 'countryName' },
          { path: 'nativeLanguage', select: 'languageName' },
        ],
      }).exec();
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email })
      .populate('country', 'countryName')
      .populate('nativeLanguage', 'languageName')
      .populate('knownLanguages', 'languageName')
      .populate('languagesToLearn', 'languageName')
      .populate({
        path: 'receivedRequests',
        select: 'username email',
        populate: [
          { path: 'country', select: 'countryName' },
          { path: 'nativeLanguage', select: 'languageName' },
        ],
      })
      .populate({
        path: 'connections',
        select: 'username email',
        populate: [
          { path: 'country', select: 'countryName' },
          { path: 'nativeLanguage', select: 'languageName' },
        ],
      }).exec();
  }

  async findAll(page: number, limit: number, search: string): Promise<{ users: IUser[], total: number }> {
    const filter = search
      ? {
          $or: [
            { username: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const skip = (page - 1) * limit;
    const users = await this.find(filter, {
      skip,
      limit,
      populate: ['country', 'nativeLanguage', 'knownLanguages', 'languagesToLearn'],
    });

    const total = await this.count(filter);
    return { users, total };
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    return super.update(id, user);
  }

  async deleteUser(id: string): Promise<void> {
    await super.delete(id);
  }

  
}

export default UserRepositoryImplementation;
