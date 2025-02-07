export interface IUserObject {
  _id: string;
  name: string;
  email: string;
  faculty: string;
  phone: string;
  evaluationIds?: string[];
  surveyIds?: string[];
}

export interface IEvaluationObject {
  _id: string;
  title: string;
  date: string;
  isFavorite: boolean;
  questionIds: string[];
}

export interface ISurveyObject {
  _id: string;
  title: string;
  date: string;
  isFavorite: boolean;
  questionIds: string[];
}

export interface IResponseObject {
  option: string;
  count: number;
}

export interface IQuestionObject {
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

export interface IQuestionResultObject {
  _id: string;
  evaluationId: string;
  categoryId: string;
  category?: string;
  type: string;
  question: string;
  options?: string[];
  responses: IResponseObject[] | string[];
  show: boolean;
  isFavorite: boolean;
}

export interface ICategoryObject {
  _id: string;
  name: string;
}

export interface ICategorizedQuestionResultsObject {
  category: string;
  questions: IQuestionResultObject[];
}

export interface ICategorizedQuestionsObject {
  category: string;
  questions: IQuestionObject[];
}

export interface IEvaluationDetailsObject extends IEvaluationObject {
  results: ICategorizedQuestionResultsObject[]; // Categorized questions with responses
}

export enum EQuestionType {
  Text = 'text',
  Scale = 'scale',
  Pie = 'pie',
  Line = 'line',
  WordCloud = 'word-cloud',
}
