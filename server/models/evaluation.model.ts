import mongoose, { Schema } from 'mongoose';

export interface IEvaluation {
  _id: string;
  title: string;
  date: string;
  isFavorite: boolean;
  questionIds: string[];
}

const EvaluationSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    title: { type: String, required: true },
    date: { type: String, required: true },
    isFavorite: { type: Boolean, required: true, default: false },
    questionIds: {
      type: [Schema.Types.ObjectId],
      required: true,
      ref: 'Question',
    },
  },
  { collection: 'evaluations' }, // Collection name
);

export const Evaluation = mongoose.model<IEvaluation>(
  'Evaluation',
  EvaluationSchema,
);
