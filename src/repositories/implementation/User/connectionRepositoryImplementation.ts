import { Country } from '../../../models/Admin/countryModel';
import { Language } from '../../../models/Admin/languageModel';
import { User, IUser } from '../../../models/User/userModel';
import { BaseRepositoryImplentation } from '../../implementation/Base/baseRepositoryImplementation'
import ConnectionRepository from '../../User/connectionRepository';

class ConnectionRepositoryImplementation
  extends BaseRepositoryImplentation<IUser>
  implements ConnectionRepository {

  constructor() {
    super(User);
  }

  async sendRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null; receiver: IUser | null }> {
    const sender = await this.model.findByIdAndUpdate(
      senderId,
      { $addToSet: { sentRequests: receiverId } },
      { new: true }
    ).exec();

    const receiver = await this.model.findByIdAndUpdate(
      receiverId,
      { $addToSet: { receivedRequests: senderId } },
      { new: true }
    ).exec();

    return { sender, receiver };
  }

  async cancelRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null; receiver: IUser | null }> {
    const sender = await this.model.findByIdAndUpdate(
      senderId,
      { $pull: { sentRequests: receiverId } },
      { new: true }
    ).exec();

    const receiver = await this.model.findByIdAndUpdate(
      receiverId,
      { $pull: { receivedRequests: senderId } },
      { new: true }
    ).exec();

    return { sender, receiver };
  }

  async rejectRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null; receiver: IUser | null }> {
    const sender = await this.model.findByIdAndUpdate(
      senderId,
      { $pull: { receivedRequests: receiverId } },
      { new: true }
    ).exec();

    const receiver = await this.model.findByIdAndUpdate(
      receiverId,
      { $pull: { sentRequests: senderId } },
      { new: true }
    ).exec();

    return { sender, receiver };
  }

  async acceptRequests(senderId: string, receiverId: string): Promise<{ sender: IUser | null; receiver: IUser | null }> {
    const sender = await this.model.findByIdAndUpdate(
      senderId,
      { $addToSet: { connections: receiverId } },
      { new: true }
    ).exec();

    const receiver = await this.model.findByIdAndUpdate(
      receiverId,
      { $addToSet: { connections: senderId } },
      { new: true }
    ).exec();

    await this.model.findByIdAndUpdate(receiverId, {
      $pull: { sentRequests: senderId },
    }).exec();

    await this.model.findByIdAndUpdate(senderId, {
      $pull: { receivedRequests: receiverId },
    }).exec();

    return { sender, receiver };
  }

  async findNativeSpeakers(
    userId: string,
    page: number,
    limit: number,
    search: string,
    nativeLanguage?: string,
    country?: string
  ): Promise<{ users: IUser[], total: number }> {
    const nativeLanguageId = nativeLanguage
      ? await Language.findOne({ languageName: nativeLanguage }).select('_id').exec()
      : null;

    const countryId = country
      ? await Country.findOne({ countryName: country }).select('_id').exec()
      : null;

    const query: any = {
      _id: { $ne: userId },
      ...(search && {
        $or: [{ username: { $regex: search, $options: 'i' } }],
      }),
      ...(nativeLanguageId && { nativeLanguage: nativeLanguageId._id }),
      ...(countryId && { country: countryId._id }),
    };

    const skip = (page - 1) * limit;

    const users = await this.find(query, {
      skip,
      limit,
      populate: ['country', 'nativeLanguage', 'knownLanguages', 'languagesToLearn'],
    });

    const total = await this.count(query);
    return { users, total };
  }

}

export default ConnectionRepositoryImplementation;
