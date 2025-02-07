import mongoose, { Schema } from 'mongoose';

export interface ICategory {
  _id: string;
  name: string;
}

const CategorySchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId },
    name: { type: String, required: true },
  },
  { collection: 'categories' },
);

export const Category = mongoose.model<ICategory>('Category', CategorySchema);
