import dotenv from 'dotenv';
dotenv.config();

import express from 'express';

import { AuthController } from '../controllers/auth.controller';
import { EvaluationController } from '../controllers/evaluation.controller';
import { LoginDto } from '../dtos/login.dto';
import { SurveyController } from '../controllers/survey.controller';
import { UserController } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/jwt.middleware';
import { validationMiddleware } from '../middlewares/validation.middleware';

const Router = express.Router();
const AuthControllerInstance = new AuthController();
const EvaluationControllerInstance = new EvaluationController();
const UserControllerInstance = new UserController();
const SurveyControllerInstance = new SurveyController();

// PREFIX: /api/v1
// prettier-ignore
Router.post('/auth/login', validationMiddleware(LoginDto), AuthControllerInstance.login);
Router.get('/auth/logout', authenticateJWT, AuthControllerInstance.logout);

Router.get('/user', authenticateJWT, UserControllerInstance.getUser);

// prettier-ignore
Router.get('/evaluations', authenticateJWT, EvaluationControllerInstance.getEvaluations);
// prettier-ignore
Router.get('/evaluations/:id', authenticateJWT, EvaluationControllerInstance.getEvaluationById);
// prettier-ignore
Router.delete('/evaluations/:id', authenticateJWT, EvaluationControllerInstance.deleteEvaluationById);
// prettier-ignore
Router.put('/evaluations/:id/results', authenticateJWT, EvaluationControllerInstance.updateAllResults);
// prettier-ignore
Router.put('/evaluations/favorite', authenticateJWT, EvaluationControllerInstance.updateFavorite);
// prettier-ignore
Router.put('/evaluations/result/:id', authenticateJWT, EvaluationControllerInstance.updateResultById);
// prettier-ignore
Router.get('/surveys', authenticateJWT, SurveyControllerInstance.getSurveys);
// prettier-ignore
Router.post('/surveys', authenticateJWT, SurveyControllerInstance.createSurvey);
// prettier-ignore
Router.get('/surveys/:id', authenticateJWT, SurveyControllerInstance.getSurveyById);
// prettier-ignore
Router.put('/surveys/:id', authenticateJWT, SurveyControllerInstance.updateSurveyById);
// prettier-ignore
Router.post('/surveys/:id/copy', authenticateJWT, SurveyControllerInstance.copySurveyById);
// prettier-ignore
Router.delete('/surveys/:id/questions/:questionId', authenticateJWT, SurveyControllerInstance.deleteSurveyQuestionById);
// prettier-ignore
Router.delete('/surveys/:id', authenticateJWT, SurveyControllerInstance.deleteSurveyById);
// prettier-ignore
Router.post('/surveys/:id', authenticateJWT, SurveyControllerInstance.createSurveyQuestion);

export default Router;
