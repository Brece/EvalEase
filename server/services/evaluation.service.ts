import { Model } from 'mongoose';

import { Category, ICategory } from '../models/category.model';
import { Evaluation, IEvaluation } from '../models/evaluation.model';
import {
  IQuestionResult,
  QuestionResult,
} from '../models/question-result.model';
import {
  categoriesLocalMockData,
  evaluationsLocalMockData,
  evaluationsMockDataPath,
  questionResultsLocalMockData,
  questionResultsMockDataPath,
  updateMockData,
} from '../database/local-mockdata';

export class EvaluationService {
  private evaluationModel: Model<IEvaluation>;
  private questionResultModel: Model<IQuestionResult>;
  private categoryModel: Model<ICategory>;
  private mockData: boolean;

  constructor() {
    this.evaluationModel = Evaluation;
    this.questionResultModel = QuestionResult;
    this.categoryModel = Category;
    this.mockData = process.env.MOCK_DB?.toLocaleLowerCase() === 'true';
  }
  async getEvaluations(): Promise<IEvaluation[]> {
    let evaluations = null;

    if (this.mockData) {
      console.log('Using local evaluations mock data');
      evaluations = evaluationsLocalMockData;
    } else {
      evaluations = await this.evaluationModel.find().lean();
    }

    if (!evaluations) {
      throw new Error('Evaluations not found');
    }

    return evaluations;
  }

  /**
   * Get evaluation by ID with answered questions for details view
   */
  async getEvaluationById(id: string): Promise<any> {
    let evaluation = null;

    if (this.mockData) {
      evaluation = evaluationsLocalMockData.find((item) => item._id === id);
    } else {
      evaluation = await this.evaluationModel.findById(id).lean();
    }

    if (!evaluation) {
      throw new Error('Evaluation not found');
    }

    const questionResults = await this.getQuestionResults(
      evaluation.questionIds,
    );
    const categorizedQuestions =
      await this.mapQuestionsToCategories(questionResults);

    return { ...evaluation, results: categorizedQuestions };
  }

  /**
   * Get evaluation results by evaluation ID
   */
  async getQuestionResults(questionIds: string[]): Promise<IQuestionResult[]> {
    let questionResults = null;

    if (this.mockData) {
      questionResults = questionResultsLocalMockData.filter((item) =>
        questionIds.includes(item._id),
      );
    } else {
      questionResults = await this.questionResultModel
        .find({
          _id: { $in: questionIds },
        })
        .lean();
    }

    if (!questionResults) {
      throw new Error('Evaluation results not found');
    }

    return questionResults;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<ICategory[]> {
    let categories = null;

    if (this.mockData) {
      categories = categoriesLocalMockData;
    } else {
      categories = await this.categoryModel.find().lean();
    }

    if (!categories) {
      throw new Error('Categories not found');
    }

    return categories;
  }

  /**
   * Map questions to categories
   */
  async mapQuestionsToCategories(questions: IQuestionResult[]): Promise<any> {
    let questionsWithCategories: {
      category: string;
      questions: IQuestionResult[];
    }[] = [];
    const categories = await this.getCategories();

    categories.forEach((category) => {
      const categoryQuestions = questions.filter(
        (question) =>
          question.categoryId.toString() === category._id.toString(),
      );

      questionsWithCategories.push({
        category: category.name,
        questions: categoryQuestions,
      });
    });

    return questionsWithCategories;
  }

  /**
   * Update the favorite status of an evaluation
   */
  async updateFavorite(id: string, isFavorite: boolean): Promise<void> {
    let evaluation = null;

    if (this.mockData) {
      evaluation = evaluationsLocalMockData.find((item) => item._id === id);

      if (!evaluation) {
        throw new Error('Evaluation not found to update favorite status');
      }

      evaluation.isFavorite = isFavorite;
      await updateMockData(evaluationsMockDataPath, evaluationsLocalMockData);
    } else {
      evaluation = await this.evaluationModel.findById(id);

      if (!evaluation) {
        throw new Error('Evaluation not found to update favorite status');
      }

      evaluation.isFavorite = isFavorite;
      await evaluation.save();
    }
  }

  /**
   * Delete an evaluation
   */
  async deleteEvaluationById(id: string): Promise<void> {
    if (this.mockData) {
      const index = evaluationsLocalMockData.findIndex(
        (item) => item._id === id,
      );

      if (index === -1) {
        throw new Error('Evaluation not found to delete');
      }

      evaluationsLocalMockData.splice(index, 1);
      await updateMockData(evaluationsMockDataPath, evaluationsLocalMockData);
    } else {
      await this.evaluationModel.findByIdAndDelete(id).exec();
    }
  }

  async updateResultById(id: string, data: IQuestionResult) {
    if (this.mockData) {
      const index = questionResultsLocalMockData.findIndex(
        (item) => item._id === id,
      );

      if (index === -1) {
        throw new Error('Evaluation result not found to update');
      }

      questionResultsLocalMockData[index] = data;
      await updateMockData(
        questionResultsMockDataPath,
        questionResultsLocalMockData,
      );

      return questionResultsLocalMockData[index]; // Return the updated object
    } else {
      const updatedData = await this.questionResultModel
        .findByIdAndUpdate(id, data, { new: true }) // { new: true } returns the updated document
        .exec();

      if (!updatedData) {
        throw new Error('Evaluation result not found to update');
      }

      return updatedData;
    }
  }

  async updateAllResults(_id: string, data: IQuestionResult[]) {
    if (this.mockData) {
      const updatedData = data.map((result) => {
        const index = questionResultsLocalMockData.findIndex(
          (item) => item._id === result._id,
        );

        if (index === -1) {
          throw new Error('Evaluation result not found to update');
        }

        questionResultsLocalMockData[index] = result;
        return questionResultsLocalMockData[index];
      });

      await updateMockData(
        questionResultsMockDataPath,
        questionResultsLocalMockData,
      );

      return updatedData;
    } else {
      const updatedData = await Promise.all(
        data.map(async (item) => {
          return this.questionResultModel
            .updateOne({ _id: item._id }, { $set: item })
            .exec();
        }),
      );

      if (!updatedData.length) {
        throw new Error('Evaluation results not found to update');
      }

      return updatedData;
    }
  }
}
