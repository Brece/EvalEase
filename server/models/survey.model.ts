import mongoose, { Schema } from 'mongoose';

export interface ISurvey {
  _id: string;
  title: string;
  date: string;
  isFavorite: boolean;
  questionIds: string[];
}

const SurveySchema: Schema = new Schema(
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
  { collection: 'surveys' }, // Collection name
);

export const Survey = mongoose.model<ISurvey>('Survey', SurveySchema);
