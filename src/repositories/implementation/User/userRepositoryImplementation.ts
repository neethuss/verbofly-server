import { User, IUser } from '../../../models/User/userModel'
import UserRepository from '../../User/userRepository'
import { Language } from '../../../models/Admin/languageModel'
import { Country } from '../../../models/Admin/countryModel'
import mongoose from 'mongoose'

class UserRepositoryImplementation implements UserRepository {
  async createUser(user: IUser): Promise<IUser> {
    const newUser = await User.create(user)
    return newUser
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await User.findById(id).populate('country', 'countryName')
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
    }).exec()
    return user
  }

  async findByEmail(email: string): Promise<IUser | null> {
    // console.log('findbe email impl')
    const user = await User.findOne({ email }).populate('country', 'countryName')
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
      })
      .exec();
      // console.log(user,'find by enal user return')
    return user
  }

  async findAll(page: number, limit: number, search: string): Promise<{ users: IUser[], total: number }> {
    const offset = (page - 1) * limit;
    const query = search
      ? {
        $or: [
          { username: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }
      : {};

    const users = await User.find(query).skip(offset).limit(limit).populate('country').populate('nativeLanguage').populate('knownLanguages').populate('languagesToLearn').exec();
    const total = await User.countDocuments(query);
    return { users, total };
  }

  async update(id: string, user: Partial<IUser>): Promise<IUser | null> {
    console.log(id, 'update id');
    console.log(user, 'update user');

    try {
      const updatedUser = await User.findByIdAndUpdate(id, user, { new: true }).exec();
      console.log(updatedUser, 'update aayath');
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }


  async findNativeSpeakers(
    userId: string,
    page: number,
    limit: number,
    search: string,
    nativeLanguage?: string,
    country?: string
  ): Promise<{ users: IUser[], total: number }> {
    const offset = (page - 1) * limit;

    const nativeLanguageId = await Language.findOne({ languageName: nativeLanguage }).select('_id').exec();
    const countryId = await Country.findOne({ countryName: country }).select('_id').exec();

    const query: any = {
      _id: { $ne: userId },
      ...(search && {
        $or: [
          { username: { $regex: search, $options: 'i' } },
        ],
      }),
      ...(nativeLanguageId && { nativeLanguage: nativeLanguageId._id }),
      ...(countryId && { country: countryId._id }),
    };

    console.log("Query:", query);
    const users = await User.find(query)
      .skip(offset)
      .limit(limit)
      .populate('country')
      .populate('nativeLanguage')
      .populate('knownLanguages')
      .populate('languagesToLearn')
      .exec();

    const total = await User.countDocuments(query);
    console.log(total, users, 'baxk')
    return { users, total };
  }


  async delete(id: string): Promise<void> {
    await User.findByIdAndDelete(id).exec()
  }

  async sendRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    const sender = await User.findByIdAndUpdate(senderId, { $addToSet: { sentRequests: receiverId } }).exec()
    const receiver = await User.findByIdAndUpdate(receiverId, { $addToSet: { receivedRequests: senderId } }).exec()
    console.log(sender, 'im[ se')
    console.log('re', receiver)
    return { sender, receiver }
  }



  async cancelRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    const sender = await User.findByIdAndUpdate(senderId, { $pull: { sentRequests: receiverId } }).exec()
    const receiver = await User.findByIdAndUpdate(receiverId, { $pull: { receivedRequests: senderId } }).exec()
    console.log(sender, 'im[ se')
    console.log('re', receiver)
    return { sender, receiver }
  }

  async acceptRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null, receiver: IUser | null }> {
    const sender = await User.findByIdAndUpdate(senderId, { $addToSet: { connections: receiverId } }).exec()
    const receiver = await User.findByIdAndUpdate(receiverId, { $addToSet: { connections: senderId } }).exec()
    await User.findByIdAndUpdate(receiverId, { $pull: { sentRequests: senderId } }, { new: true }).exec()
    await User.findByIdAndUpdate(senderId, { $pull: { receivedRequests: receiverId } }, { new: true }).exec()
    console.log('jhashjhjshadsajhsjdhsjdh',sender, 'im[ se')
    console.log('re', receiver)
    return { sender, receiver }
  }
}



export default UserRepositoryImplementation