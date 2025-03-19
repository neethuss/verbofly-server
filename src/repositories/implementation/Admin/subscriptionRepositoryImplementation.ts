import { ISubscription, Subscription } from "../../../models/User/subscriptionModel";
import SubscriptionRepository from "../../Admin/subscriptionRepository";

class SubscriptionRepositoryImplementation implements SubscriptionRepository{
  

  async findAll(page: number, limit: number, search: string): Promise<{ subscriptions: ISubscription[]; total: number; }> {
    const offset = (page-1) *limit
    const query = search ? {
      $or: [
        {
          languageName : {$regex :search, $options:'i'}
        }
      ]
    } : {}

    const subscriptions = await Subscription.find(query).skip(offset).limit(limit).populate('userId').exec()
    const total = await Subscription.countDocuments(query)
    return {subscriptions, total}
  }

 

}

export default SubscriptionRepositoryImplementation