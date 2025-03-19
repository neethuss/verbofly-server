import { Schema, model, Document, Types, Date } from "mongoose";

interface ISubscription extends Document{
  userId : string;
  amount : number
  orderId:string
  expirationDate : Date
  subscriptionDate:Date
} 

const SubscriptionSchma = new Schema<ISubscription>({
  userId : {type : String, required: true},
  amount : {type: Number,default:199, required: true},
  orderId:{type:String},
  expirationDate : {type : Date, default : null},
  subscriptionDate:{type:Date , default: Date.now}
})

const Subscription = model<ISubscription>('Subscription',SubscriptionSchma)

export {ISubscription, Subscription}