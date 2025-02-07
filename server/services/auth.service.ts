import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

import { User, IUser } from '../models/user.model';
import { usersLocalMockData } from '../database/local-mockdata';

export class AuthService {
  private jwtSecret: string;
  private mockData: boolean;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'mysecret';
    this.mockData = process.env.MOCK_DB?.toLocaleLowerCase() === 'true';
  }

  /**
   * Login a user
   */
  async login(
    email: string,
    password: string,
  ): Promise<Omit<IUser, 'password'>> {
    let user = null;

    if (this.mockData) {
      console.log('Using local mock data');
      user = usersLocalMockData.find((user) => user.email === email);
    } else {
      user = await User.findOne({ email }).lean(); // Lean returns a plain JS object without Mongoose methods
    }

    if (!user) {
      throw new Error('Invalid email');
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // Clear the password from the user object
    const { password: _password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  /**
   * Generate a JWT token
   * @param user User object contains non-sensitive information
   */
  generateJwtToken(user: any, res: Response) {
    const token = jwt.sign({ user }, this.jwtSecret, { expiresIn: '6h' }); // match lifespan of cookie

    res.cookie('app_token', token, {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 6 * 60 * 60 * 1000, // 6 hours
      sameSite: 'strict',
    });

    return token;
  }
}
