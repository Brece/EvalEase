import fs from 'fs';
import mongoose from 'mongoose';
import path, { dirname } from 'path';
import { ObjectId } from 'mongodb';
import { fileURLToPath } from 'url';

// Hardcoded user for demonstration purposes
// TODO: password is test123

// Resolve path relative to this file: server/database/local-mockdata.ts
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const usersMockDataPath = path.resolve(
  __dirname,
  './mockdata/users.mockdata.json',
);
export const evaluationsMockDataPath = path.resolve(
  __dirname,
  './mockdata/evaluations.mockdata.json',
);
export const questionsMockDataPath = path.resolve(
  __dirname,
  './mockdata/questions.mockdata.json',
);
export const questionResultsMockDataPath = path.resolve(
  __dirname,
  './mockdata/question-results.mockdata.json',
);
export const categoriesMockDataPath = path.resolve(
  __dirname,
  './mockdata/categories.mockdata.json',
);
export const surveysMockDataPath = path.resolve(
  __dirname,
  './mockdata/surveys.mockdata.json',
);
export const defaultQuestionsMockDataPath = path.resolve(
  __dirname,
  './mockdata/default-questions.mockdata.json',
);

/**
 * Read the mock data from the JSON files
 */
export const usersLocalMockData: any[] = JSON.parse(
  fs.readFileSync(usersMockDataPath, 'utf8'),
);

export const evaluationsLocalMockData: any[] = JSON.parse(
  fs.readFileSync(evaluationsMockDataPath, 'utf8'),
);

export const questionsLocalMockData: any[] = JSON.parse(
  fs.readFileSync(questionsMockDataPath, 'utf8'),
);

export const questionResultsLocalMockData: any[] = JSON.parse(
  fs.readFileSync(questionResultsMockDataPath, 'utf8'),
);

export const categoriesLocalMockData: any[] = JSON.parse(
  fs.readFileSync(categoriesMockDataPath, 'utf8'),
);

export const surveysLocalMockData: any[] = JSON.parse(
  fs.readFileSync(surveysMockDataPath, 'utf8'),
);

export const defaultQuestionsLocalMockData: any[] = JSON.parse(
  fs.readFileSync(defaultQuestionsMockDataPath, 'utf8'),
);

export async function updateMockData<T>(
  path: string,
  data: T[],
): Promise<void> {
  try {
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Failed to update mock data at ${path}:`, err);
    throw new Error('An error occurred trying to update the mock data');
  }
}

export function loadMockData() {
  // TODO: load more data from other JSON files
  const usersData = usersLocalMockData.map((user: any) => ({
    ...user,
    _id: ObjectId.createFromHexString(user._id), // convert string to ObjectId manually
    evaluationIds: user.evaluationIds.map((id: string) =>
      ObjectId.createFromHexString(id),
    ),
  }));

  const evaluationsData = evaluationsLocalMockData.map((evaluation: any) => ({
    ...evaluation,
    _id: ObjectId.createFromHexString(evaluation._id),
  }));

  const questionsData = questionsLocalMockData.map((question: any) => ({
    ...question,
    _id: ObjectId.createFromHexString(question._id),
    surveyId: ObjectId.createFromHexString(question.surveyId),
    categoryId: ObjectId.createFromHexString(question.categoryId),
  }));

  const questionResultsData = questionResultsLocalMockData.map(
    (question: any) => ({
      ...question,
      _id: ObjectId.createFromHexString(question._id),
      evaluationId: ObjectId.createFromHexString(question.evaluationId),
      categoryId: ObjectId.createFromHexString(question.categoryId),
    }),
  );

  const categoriesData = categoriesLocalMockData.map((category: any) => ({
    ...category,
    _id: ObjectId.createFromHexString(category._id),
  }));

  const surveysData = surveysLocalMockData.map((survey: any) => ({
    ...survey,
    _id: ObjectId.createFromHexString(survey._id),
    questionIds: survey.questionIds.map((id: string) =>
      ObjectId.createFromHexString(id),
    ),
  }));

  const defaultQuestionsData = defaultQuestionsLocalMockData.map(
    (question: any) => ({
      ...question,
      _id: new mongoose.Types.ObjectId(),
    }),
  );

  return {
    usersData,
    evaluationsData,
    questionsData,
    questionResultsData,
    categoriesData,
    surveysData,
    defaultQuestionsData,
  };
}
