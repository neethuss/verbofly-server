import { ISubscription } from "../../models/User/subscriptionModel";
import SubscriptionRepository from "../../repositories/Admin/subscriptionRepository";

class SubscriptionService{
  private subscriptionRespository : SubscriptionRepository

  constructor(subscriptionRespository : SubscriptionRepository){
    this.subscriptionRespository = subscriptionRespository
  }

  async findAll(page:number, limit:number, search:string) : Promise<{subscriptions:ISubscription[], total:number}>{
    const result = await this.subscriptionRespository.findAll(page, limit, search)
    return result
  }

}

export default SubscriptionService