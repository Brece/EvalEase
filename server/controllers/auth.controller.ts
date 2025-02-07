import { Request, Response } from 'express';

import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body; // DTO is validated by middleware

      const user = await this.authService.login(email, password);

      this.authService.generateJwtToken(user, res);

      res.status(200).json({
        message: 'Login successful',
        user,
      });
    } catch (err) {
      if (err instanceof Error) {
        res.status(401).json({ message: err.message });
      } else {
        res
          .status(400)
          .json({ message: 'An unknown error occurred trying to login' });
      }
    }
  };

  /**
   * Logout a user
   */
  logout = async (_req: Request, res: Response) => {
    try {
      res.clearCookie('app_token');
      res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      if (err instanceof Error) {
        res.status(401).json({ message: err.message });
      } else {
        res
          .status(400)
          .json({ message: 'An unknown error occurred trying to logout' });
      }
    }
  };
}
