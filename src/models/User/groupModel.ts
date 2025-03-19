import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './userModel';

interface IGroup extends Document {
  name: string;
  admin: Types.ObjectId | IUser
  members: (Types.ObjectId | IUser)[];
}

const GroupSchema = new Schema<IGroup>({
  name: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
});

const Group = model<IGroup>('Group', GroupSchema);

export { Group, IGroup };