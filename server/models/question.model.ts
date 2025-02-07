import mongoose, { Schema } from 'mongoose';

export interface IQuestion {
  _id: string;
  surveyId: string;
  categoryId: string;
  category?: string;
  type: string;
  question: string;
  options?: string[];
  responses: [];
  show: boolean;
  isFavorite: boolean;
}

const QuestionSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    surveyId: { type: Schema.Types.ObjectId, ref: 'Survey' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    category: { type: String, required: false },
    type: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: false },
    responses: { type: [Schema.Types.Mixed], required: true },
    show: { type: Boolean, required: true, default: true },
    isFavorite: { type: Boolean, required: true, default: false },
  },
  { collection: 'questions' }, // Collection name
);

export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
