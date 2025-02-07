import { Response } from 'express';

import { ICustomJwtRequest } from '../middlewares/jwt.middleware';
import { SurveyService } from '../services/survey.service';

export class SurveyController {
  private surveyService: SurveyService;

  constructor() {
    this.surveyService = new SurveyService();
  }

  getSurveys = async (_req: ICustomJwtRequest, res: Response) => {
    try {
      const surveys = await this.surveyService.getSurveys();

      res.status(200).json(surveys);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to get surveys',
        });
      }
    }
  };

  getSurveyById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;
      let survey = null;

      if (id === '0') {
        survey = await this.surveyService.getDefaultSurvey();
      } else {
        survey = await this.surveyService.getSurveyById(id);
      }

      res.status(200).json(survey);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to get survey',
        });
      }
    }
  };

  createSurvey = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { data } = req.body;

      const survey = await this.surveyService.createSurvey(data);

      res.status(201).json(survey);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to create survey',
        });
      }
    }
  };

  createSurveyQuestion = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;
      const {
        data,
      }: {
        data: {
          question: string;
          options: string[];
          displayType: string;
        };
      } = req.body;

      const survey = await this.surveyService.createSurveyQuestion(id, data);

      res.status(200).json(survey);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to update survey',
        });
      }
    }
  };

  updateSurveyById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { data } = req.body;

      const survey = await this.surveyService.updateSurveyById(id, data);

      res.status(200).json(survey);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to update survey',
        });
      }
    }
  };

  copySurveyById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;

      const survey = await this.surveyService.copySurveyById(id);

      res.status(200).json(survey);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to copy survey',
        });
      }
    }
  };

  deleteSurveyById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;

      await this.surveyService.deleteSurveyById(id);

      res.status(200).json({ message: 'Survey deleted' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to delete survey',
        });
      }
    }
  };

  deleteSurveyQuestionById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id, questionId } = req.params;

      await this.surveyService.deleteSurveyQuestionById(id, questionId);

      res.status(200).json({ message: 'Survey question deleted' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to delete survey question',
        });
      }
    }
  };
}
