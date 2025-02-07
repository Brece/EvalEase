import { Response } from 'express';

import { ICustomJwtRequest } from '../middlewares/jwt.middleware';
import { EvaluationService } from '../services/evaluation.service';

export class EvaluationController {
  private evaluationService: EvaluationService;

  constructor() {
    this.evaluationService = new EvaluationService();
  }

  getEvaluations = async (_req: ICustomJwtRequest, res: Response) => {
    try {
      const evaluations = await this.evaluationService.getEvaluations();

      res.status(200).json(evaluations);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to get evaluations',
        });
      }
    }
  };

  getEvaluationById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;

      const evaluation = await this.evaluationService.getEvaluationById(id);

      res.status(200).json(evaluation);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to get evaluation',
        });
      }
    }
  };

  updateFavorite = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { _id, isFavorite } = req.body;

      await this.evaluationService.updateFavorite(_id, isFavorite);

      res.status(200).json({ message: 'Favorite status updated successfully' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to update favorite status',
        });
      }
    }
  };

  deleteEvaluationById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;

      await this.evaluationService.deleteEvaluationById(id);

      res.status(200).json({ message: 'Evaluation deleted successfully' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message: 'An unknown error occurred trying to delete evaluation',
        });
      }
    }
  };

  updateResultById = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { data } = req.body;

      const updatedData = await this.evaluationService.updateResultById(
        id,
        data,
      );

      res.status(200).json({
        data: updatedData,
        message: 'Evaluation result updated successfully',
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message:
            'An unknown error occurred trying to update evaluation result',
        });
      }
    }
  };

  updateAllResults = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { data } = req.body;

      const updatedData = await this.evaluationService.updateAllResults(
        id,
        data,
      );

      res.status(200).json({
        data: updatedData,
        message: 'All evaluation results updated successfully',
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res.status(400).json({
          message:
            'An unknown error occurred trying to update all evaluation results',
        });
      }
    }
  };
}
