import { Model } from 'mongoose';

import { IUser, User } from '../models/user.model';
import { usersLocalMockData } from '../database/local-mockdata';

export class UserService {
  private userModel: Model<IUser>;
  private mockData: boolean;

  constructor() {
    this.userModel = User;
    this.mockData = process.env.MOCK_DB?.toLocaleLowerCase() === 'true';
  }

  async getUser(id: string): Promise<IUser> {
    let user = null;

    if (this.mockData) {
      console.log('Using local mock data');
      user = usersLocalMockData.find((user) => user._id === id);
    } else {
      user = await this.userModel.findById(id);
    }

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
