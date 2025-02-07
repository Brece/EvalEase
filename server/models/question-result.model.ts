import mongoose, { Schema } from 'mongoose';

interface IResponse {
  option: string;
  count: number;
}
export interface IQuestionResult {
  _id: string;
  evaluationId: string;
  categoryId: string;
  category?: string;
  type: string;
  question: string;
  options?: string[];
  responses: IResponse[] | string[];
  show: boolean;
  isFavorite: boolean;
}

const QuestionResultSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    evaluationId: { type: Schema.Types.ObjectId, ref: 'Evaluation' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    category: { type: String, required: false },
    type: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: false },
    responses: { type: [Schema.Types.Mixed], required: true },
    show: { type: Boolean, required: true, default: true },
    isFavorite: { type: Boolean, required: true, default: false },
  },
  { collection: 'question-results' }, // Collection name
);

export const QuestionResult = mongoose.model<IQuestionResult>(
  'QuestionResult',
  QuestionResultSchema,
);
