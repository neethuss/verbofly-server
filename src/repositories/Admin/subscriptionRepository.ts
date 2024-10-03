import { Types } from "mongoose";
import { ISubscription } from "../../models/User/subscriptionModel";

interface SubscriptionRepository{
  findAll(page : number, limit: number, search : string) : Promise<{subscriptions : ISubscription[], total : number}>
}

export default SubscriptionRepository