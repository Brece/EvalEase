import { Response } from 'express';

import { ICustomJwtRequest } from '../middlewares/jwt.middleware';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUser = async (req: ICustomJwtRequest, res: Response) => {
    try {
      const userId = req.user?._id;

      if (!userId) {
        throw new Error('User ID not provided');
      }

      const user = await this.userService.getUser(userId);

      res.status(200).json(user);
    } catch (err) {
      if (err instanceof Error) {
        res.status(400).json({ message: err.message });
      } else {
        res
          .status(400)
          .json({ message: 'An unknown error occurred trying to get user' });
      }
    }
  };
}
