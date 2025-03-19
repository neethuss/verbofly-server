import { Schema, model, Document, Types } from 'mongoose';
import { IMessage } from './messageModel';

interface IChat extends Document {
  user1Id: Types.ObjectId;
  user2Id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: IMessage;
}

const ChatSchema = new Schema<IChat>({
  user1Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user2Id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Chat = model<IChat>('Chat', ChatSchema);

export { Chat, IChat };