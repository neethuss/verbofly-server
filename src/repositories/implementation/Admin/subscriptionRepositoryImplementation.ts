
import { ISubscription, Subscription } from "../../../models/User/subscriptionModel";
import SubscriptionRepository from "../../Admin/subscriptionRepository";
import { BaseRepositoryImplentation } from "../Base/baseRepositoryImplementation";
import { FilterQuery } from "mongoose";

class SubscriptionRepositoryImplementation
  extends BaseRepositoryImplentation<ISubscription>
  implements SubscriptionRepository
{
  constructor() {
    super(Subscription); 
  }

  async findAll(
    page: number,
    limit: number,
    search: string
  ): Promise<{ subscriptions: ISubscription[]; total: number }> {
    const offset = (page - 1) * limit;

    const query: FilterQuery<ISubscription> = search
      ? {
          $or: [
            {
              languageName: { $regex: search, $options: "i" },
            },
          ],
        }
      : {};

    const subscriptions = await this.find(query, {
      skip: offset,
      limit,
      populate: "userId",
    });

    const total = await this.count(query);

    return { subscriptions, total };
  }
}

export default SubscriptionRepositoryImplementation;
