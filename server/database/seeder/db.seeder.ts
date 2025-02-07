import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';

import { Category } from '../../models/category.model';
import { DefaultQuestion } from '../../models/default-questions.model';
import { Evaluation } from '../../models/evaluation.model';
import { Question } from '../../models/question.model';
import { QuestionResult } from '../../models/question-result.model';
import { Survey } from '../../models/survey.model';
import { User } from '../../models/user.model';
import { loadMockData } from '../local-mockdata';

async function seedDatabase() {
  const dbUri =
    process.env.NODE_ENV === 'development'
      ? process.env.DATABASE_URI_DEV
      : process.env.DATABASE_URI_PROD;

  if (!dbUri) {
    throw new Error('Database URI is not defined');
  }

  try {
    const connection = await mongoose.connect(dbUri);
    console.log(`MongoDB connected: ${connection.connection.host}`);

    // TODO: clear more collections
    // clear existing data
    await User.deleteMany({});
    await Evaluation.deleteMany({});
    await Question.deleteMany({});
    await QuestionResult.deleteMany({});
    await Category.deleteMany({});
    await Survey.deleteMany({});
    await DefaultQuestion.deleteMany({});

    // insert JSON data
    const {
      usersData,
      evaluationsData,
      questionsData,
      questionResultsData,
      categoriesData,
      surveysData,
      defaultQuestionsData,
    } = loadMockData();
    await User.insertMany(usersData);
    await Evaluation.insertMany(evaluationsData);
    await Question.insertMany(questionsData);
    await QuestionResult.insertMany(questionResultsData);
    await Category.insertMany(categoriesData);
    await Survey.insertMany(surveysData);
    await DefaultQuestion.insertMany(defaultQuestionsData);

    console.log('Data imported successfully');
  } catch (error) {
    console.error('Error seeding the database', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
