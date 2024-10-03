import { Schema, model, Document, Types } from 'mongoose';

interface IMessage extends Document {
  chatId: Types.ObjectId;
  senderId: Types.ObjectId;
  messageText: string;
  createdAt: Date;
  readAt:Date;
  image:string
  audio:string
  call:boolean
}

const MessageSchema = new Schema<IMessage>({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageText: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  readAt:{type:Date, default:null},
  image:{type:String, required:false},
  audio:{type:String, required:false},
  call:{type:Boolean, required:false, default:false}
});

const Message = model<IMessage>('Message', MessageSchema);

export { Message, IMessage };