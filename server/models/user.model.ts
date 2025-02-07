import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  faculty: string;
  phone: string;
  evaluationIds?: string[];
  surveyIds?: string[];
}

const UserSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    faculty: { type: String, required: true },
    phone: { type: String, required: true },
    evaluationIds: { type: [Schema.Types.ObjectId], ref: 'Evaluation' },
    surveyIds: { type: [Schema.Types.ObjectId], ref: 'Survey' },
  },
  { collection: 'users' }, // Collection name
);

// Pre-save hook to hash the password
UserSchema.pre('save', async function (next) {
  const user = this as unknown as IUser;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  next();
});

export const User = mongoose.model<IUser>('User', UserSchema);
