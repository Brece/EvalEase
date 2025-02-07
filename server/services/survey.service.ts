import mongoose, { Model } from 'mongoose';

import { IQuestion, Question } from '../models/question.model';
import { ISurvey, Survey } from '../models/survey.model';
import {
  categoriesLocalMockData,
  defaultQuestionsLocalMockData,
  questionsLocalMockData,
  questionsMockDataPath,
  surveysLocalMockData,
  surveysMockDataPath,
  updateMockData,
} from '../database/local-mockdata';
import { Category, ICategory } from '../models/category.model';
import {
  DefaultQuestion,
  IDefaultQuestion,
} from '../models/default-questions.model';

export class SurveyService {
  private surveyModel: Model<ISurvey>;
  private questionModel: Model<IQuestion>;
  private categoryModel: Model<ICategory>;
  private defaultQuestionsModel: Model<IDefaultQuestion>;
  private mockData: boolean;

  constructor() {
    this.surveyModel = Survey;
    this.questionModel = Question;
    this.categoryModel = Category;
    this.defaultQuestionsModel = DefaultQuestion;
    this.mockData = process.env.MOCK_DB?.toLocaleLowerCase() === 'true';
  }

  async getSurveys(): Promise<ISurvey[]> {
    let surveys = null;

    if (this.mockData) {
      surveys = surveysLocalMockData;
    } else {
      surveys = await this.surveyModel.find().lean();
    }

    if (!surveys) {
      throw new Error('Surveys not found');
    }

    return surveys;
  }

  async getSurveyById(id: string): Promise<any> {
    let survey = null;

    if (this.mockData) {
      survey = surveysLocalMockData.find((item) => item._id === id);
    } else {
      survey = await this.surveyModel.findById(id).lean();
    }

    if (!survey) {
      throw new Error('Survey not found');
    }

    const questions = await this.getQuestions(survey.questionIds);
    const categorizedQuestions = await this.mapQuestionsToCategories(questions);

    return { ...survey, questions: categorizedQuestions };
  }

  async getDefaultSurvey(): Promise<any> {
    let survey = {
      _id: '0', // Placeholder ID
      title: 'New Survey',
      date: new Date().toISOString(),
      isFavorite: false,
      questionIds: [], // Will be populated
    };

    const questions = await this.getDefaultQuestions();
    const categorizedQuestions = await this.mapQuestionsToCategories(questions);

    return { ...survey, questions: categorizedQuestions };
  }

  async getQuestions(questionIds: string[]): Promise<IQuestion[]> {
    let questions: any = null;

    if (this.mockData) {
      questions = questionsLocalMockData.filter((item) =>
        questionIds.includes(item._id),
      );
    } else {
      questions = await this.questionModel
        .find({ _id: { $in: questionIds } })
        .lean();
    }

    if (!questions) {
      throw new Error('Questions not found');
    }

    // Sort questions by order of questionIds -> important for drag and drop in survey builder
    questions = questionIds.map((id) =>
      questions.find(
        (question: IQuestion) => question._id.toString() === id.toString(),
      ),
    );

    return questions;
  }

  async getDefaultQuestions(): Promise<IQuestion[]> {
    let questions = null;

    if (this.mockData) {
      questions = defaultQuestionsLocalMockData;
    } else {
      questions = await this.defaultQuestionsModel.find().lean();
    }

    if (!questions) {
      throw new Error('Questions not found');
    }

    return questions;
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
  async mapQuestionsToCategories(questions: IQuestion[]): Promise<any> {
    let questionsWithCategories: {
      category: string;
      questions: IQuestion[];
    }[] = [];
    const categories = await this.getCategories();

    categories.forEach((category) => {
      const categoryQuestions = questions.filter(
        (question) => question.category === category.name,
      );

      questionsWithCategories.push({
        category: category.name,
        questions: categoryQuestions,
      });
    });

    return questionsWithCategories;
  }

  async createSurvey(data: any): Promise<ISurvey> {
    // Create baasic survey object
    let survey: ISurvey = {
      _id: new mongoose.Types.ObjectId().toString(),
      title: data,
      date: new Date().toISOString(),
      isFavorite: false,
      questionIds: [], // Will be populated
    };

    if (this.mockData) {
      // Create baasic survey object
      survey = {
        _id: new mongoose.Types.ObjectId().toString(),
        title: data,
        date: new Date().toISOString(),
        isFavorite: false,
        questionIds: [], // Will be populated
      };

      // Add default questions to survey with this ID, each question will have an unique ID
      defaultQuestionsLocalMockData.forEach((question) => {
        const questionId = new mongoose.Types.ObjectId().toString();
        const categoryId = categoriesLocalMockData.find(
          (category) => category.name === question.category,
        )?._id;

        survey.questionIds.push(questionId);
        questionsLocalMockData.push({
          ...question,
          _id: questionId,
          surveyId: survey._id,
          categoryId,
        });
      });

      surveysLocalMockData.push(survey);
      await updateMockData(questionsMockDataPath, questionsLocalMockData);
      await updateMockData(surveysMockDataPath, surveysLocalMockData);

      return survey;
    } else {
      // Add default questions from database to survey with this ID, each question will have an unique ID
      const questions = await this.getDefaultQuestions();
      const questionIds = questions.map((question) => question._id);

      survey = await this.surveyModel.create({
        ...survey,
        questionIds,
      });

      questions.forEach(async (question) => {
        const categoryId = (
          await this.categoryModel.findOne({ name: question.category })
        )?._id;
        await this.questionModel.create({
          ...question,
          surveyId: survey._id,
          categoryId,
        });
      });
    }

    if (!survey) {
      throw new Error('Survey not created');
    }

    return survey;
  }

  async createSurveyQuestion(id: string, data: any): Promise<ISurvey | null> {
    let survey = null;

    if (this.mockData) {
      survey = surveysLocalMockData.find((item) => item._id === id);

      if (!survey) {
        throw new Error('Survey not found to update');
      }

      // Create new question object, link it to survey id and category id for "Personalisierte Fragen"
      const category = categoriesLocalMockData.find(
        (item) => item.name === 'Personalisierte Fragen',
      );

      if (!category) {
        throw new Error('Category not found to add question');
      }

      const questionId = new mongoose.Types.ObjectId().toString();
      const newQuestion: any = {
        _id: questionId,
        surveyId: survey._id,
        categoryId: category._id,
        type: data.displayType,
        question: data.question,
        show: true,
        isFavorite: false,
        category: category.name,
        responses: [],
        ...(data.displayType !== 'text' ? { options: data.options } : {}),
      };

      // Update survey by adding question id to questionIds
      survey.questionIds.push(questionId);
      questionsLocalMockData.push(newQuestion);
      await updateMockData(questionsMockDataPath, questionsLocalMockData);
      await updateMockData(surveysMockDataPath, surveysLocalMockData);

      return survey;
    } else {
      // Create new question object, link it to survey id and category id for "Personalisierte Fragen"
      const category = await this.categoryModel.findOne({
        name: 'Personalisierte Fragen',
      });

      if (!category) {
        throw new Error('Category not found to add question');
      }

      const newQuestion = await this.questionModel.create({
        _id: new mongoose.Types.ObjectId(),
        surveyId: new mongoose.Types.ObjectId(id),
        categoryId: category._id,
        type: data.displayType,
        question: data.question,
        show: true,
        isFavorite: false,
        category: category.name,
        responses: [],
        ...(data.displayType !== 'text' ? { options: data.options } : {}),
      });

      if (!newQuestion) {
        throw new Error('Question not created');
      }

      // Update survey by adding question id to questionIds
      survey = await this.surveyModel.findByIdAndUpdate(
        id,
        { $push: { questionIds: newQuestion._id } },
        { new: true },
      );

      if (!survey) {
        throw new Error('Survey not found to update questionIds');
      }
    }

    return survey;
  }

  async updateSurveyById(id: string, data: ISurvey): Promise<ISurvey | null> {
    let survey: ISurvey | null = null;

    if (this.mockData) {
      survey = surveysLocalMockData.find((item) => item._id === id);

      if (!survey) {
        throw new Error('Survey not found to update');
      }

      // Update survey questionIds, title and isFavorite
      const updatedSurveys: ISurvey[] = surveysLocalMockData.map((item) =>
        item._id === id ? data : item,
      );

      // Update in-memory data to reflect changes
      surveysLocalMockData.length = 0;
      surveysLocalMockData.push(...updatedSurveys);

      await updateMockData(surveysMockDataPath, updatedSurveys);

      return survey;
    } else {
      survey = await this.surveyModel.findByIdAndUpdate(
        id,
        { ...data },
        { new: true },
      );

      if (!survey) {
        throw new Error('Survey not found to update questionIds');
      }
    }

    return survey;
  }

  async copySurveyById(id: string): Promise<ISurvey> {
    let survey: ISurvey | null = null;

    if (this.mockData) {
      survey = surveysLocalMockData.find((item) => item._id === id);

      if (!survey) {
        throw new Error('Survey not found to copy');
      }

      const newSurvey = {
        ...survey,
        _id: new mongoose.Types.ObjectId().toString(),
        title: `${survey.title} (Copy)`,
        date: new Date().toISOString(),
      };

      // Copy questions and link them to new survey
      const newQuestionIds = survey.questionIds.map((questionId: string) => {
        const question = questionsLocalMockData.find(
          (item) => item._id === questionId,
        );

        if (!question) {
          throw new Error('Question not found to copy');
        }

        const newQuestionId = new mongoose.Types.ObjectId().toString();
        questionsLocalMockData.push({
          ...question,
          _id: newQuestionId,
          surveyId: newSurvey._id,
        });

        return newQuestionId;
      });

      newSurvey.questionIds = newQuestionIds;
      surveysLocalMockData.push(newSurvey);

      // Update mock data
      await updateMockData(questionsMockDataPath, questionsLocalMockData);
      await updateMockData(surveysMockDataPath, surveysLocalMockData);

      return newSurvey;
    } else {
      survey = await this.surveyModel.findById(id);

      if (!survey) {
        throw new Error('Survey not found to copy');
      }

      const surveyId = new mongoose.Types.ObjectId();
      const questionIds: mongoose.Types.ObjectId[] = [];
      const questions = await this.getQuestions(survey.questionIds);

      questions.forEach(async (question) => {
        const questionId = new mongoose.Types.ObjectId();
        questionIds.push(questionId);
        await this.questionModel.create({
          ...question,
          _id: questionId,
          surveyId: surveyId,
        });
      });

      const newSurvey = await this.surveyModel.create({
        ...survey,
        _id: surveyId,
        title: `${survey.title} (Copy)`,
        date: new Date().toISOString(),
        questionIds,
      });

      return newSurvey;
    }
  }

  /**
   * Delete a survey by ID and linked questions
   */
  async deleteSurveyById(id: string): Promise<any> {
    let survey = null;

    if (this.mockData) {
      console.log('deleting mock survey');

      survey = surveysLocalMockData.find((item) => item._id === id);

      if (!survey) {
        throw new Error('Survey not found to delete');
      }

      const updatedSurveys = surveysLocalMockData.filter(
        (item) => item._id !== id,
      );
      const updatedQuestions = questionsLocalMockData.filter(
        (item) => item.surveyId !== id,
      );

      // Update in-memory data to reflect changes -> otherwise it will load deleted survey from memory instead of updated files
      questionsLocalMockData.length = 0;
      questionsLocalMockData.push(...updatedQuestions);
      surveysLocalMockData.length = 0;
      surveysLocalMockData.push(...updatedSurveys);

      // Update mock data
      await updateMockData(questionsMockDataPath, updatedQuestions);
      await updateMockData(surveysMockDataPath, updatedSurveys);
    } else {
      survey = await this.surveyModel.findByIdAndDelete(id);

      if (!survey) {
        throw new Error('Survey not found to delete');
      }

      await this.questionModel.deleteMany({ surveyId: id });
    }
  }

  async deleteSurveyQuestionById(surveyId: string, questionId: string) {
    let survey: any = null;

    if (this.mockData) {
      survey = surveysLocalMockData.find((item) => item._id === surveyId);

      if (!survey) {
        throw new Error('Survey not found to delete question');
      }

      survey.questionIds = survey.questionIds.filter(
        (id: string) => id !== questionId,
      );
      const updatedSurveys = surveysLocalMockData.map((item) =>
        item._id === surveyId ? survey : item,
      );
      const updatedQuestions = questionsLocalMockData.filter(
        (item) => item._id !== questionId,
      );

      // Update mock data
      await updateMockData(surveysMockDataPath, updatedSurveys);
      await updateMockData(questionsMockDataPath, updatedQuestions);
    } else {
      // Update survey by removing question id from questionIds
      survey = await this.surveyModel.findByIdAndUpdate(
        surveyId,
        { $pull: { questionIds: questionId } },
        { new: true },
      );

      if (!survey) {
        throw new Error('Survey not found to update questionIds');
      }

      // Delete question
      await this.questionModel.findByIdAndDelete(questionId);
    }
    return survey;
  }
}
