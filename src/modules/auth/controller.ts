import { Request, Response } from 'express';
import { RefreshToken, User } from '../user/model';
import { createRefreshToken, createUser, getRefreshToken, getUser, signOut } from './service';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { expiresIn, expiresInRefreshToken, SECRET_KEY } from '../../constant';
import { isTokenExpired } from '../../utils/date-time';

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;
  try {
    // Check if the email already exists
    const existingUser: User | undefined = await getUser({email})
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists', status: 400});
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10); // Hash with a salt of 10 rounds

    const newUser: User = {
      email,
      password: hashedPassword,
      hash: hashedPassword, 
      firstName,
      lastName,
      updatedAt: new Date(),
    };
    const ressult = await createUser(newUser);

    const data = {
      id: ressult[0],
      email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`
    }
    res.status(201).json({ user: data });
  } catch (error) {
    console.log({ERROR: error})
    res.status(500).json({ error: 'SERVER SOMETHING ERROR', status: 500 });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: User | undefined = await getUser({email})
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid credentials' }); 
      return;
    }

    const accessToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn });
    let refreshToken = null;
    const refreshTokenExist: RefreshToken = await getRefreshToken({userId: user.id as number})

    if(!refreshTokenExist || isTokenExpired(refreshTokenExist.expiresIn)) {
      refreshToken = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: expiresInRefreshToken });
      createRefreshToken({
        userId: user.id as number,
        refreshToken,
        updatedAt: new Date(),
        expiresIn: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }).then()
    } else {
      refreshToken = refreshTokenExist
    }

    res.status(200).json({ token: accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER SOMETHING ERROR', status: 500 });
  }
};

export const logOut = async(req: Request, res: Response): Promise<void> => {
  try {
    const {userId} = req.body;
    await signOut(userId)
    res.status(204).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'SERVER SOMETHING ERROR', status: 500 });
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  try { 
    const existingToken: RefreshToken = await getRefreshToken({refreshToken})
    if (!existingToken) {
      res.status(401).json({ error: 'Invalid refresh token' }); // 401: Unauthorized
      return;
    }

    if (isTokenExpired(existingToken.expiresIn)) {
      res.status(401).json({ error: 'Refresh token has expired' });
      return;
    }

    const accessToken = jwt.sign({ userId: existingToken.userId }, SECRET_KEY, { expiresIn });
    const newrefreshToken = jwt.sign({ userId: existingToken.userId }, SECRET_KEY, { expiresIn: expiresInRefreshToken });

    res.status(200).json({ token: accessToken, refreshToken: newrefreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to refresh token' }); // 500: Internal Server Error
  }
};
