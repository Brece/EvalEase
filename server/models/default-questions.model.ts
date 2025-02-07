import mongoose, { Schema } from 'mongoose';

interface IResponse {
  option: string;
  count: number;
}

export interface IDefaultQuestion {
  _id: string;
  category?: string;
  type: string;
  question: string;
  options?: string[];
  responses: IResponse[] | string[];
  show: boolean;
  isFavorite: boolean;
}

const DefaultQuestionSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    category: { type: String, required: true },
    type: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: false },
    responses: { type: [Schema.Types.Mixed], required: true },
    show: { type: Boolean, default: true },
    isFavorite: { type: Boolean, default: false },
  },
  { collection: 'default-questions' }, // Category name
);

export const DefaultQuestion = mongoose.model<IDefaultQuestion>(
  'DefaultQuestion',
  DefaultQuestionSchema,
);
