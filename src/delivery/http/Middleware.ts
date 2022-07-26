require('dotenv').config();

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export default class Middleware {
  public static authentication = (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = String(req.headers['authorization'])!.split(' ')[1];

      res.locals.user = jwt.verify(
        token,
        String(process.env.ACCESS_TOKEN_SECRET)
      )

      next()
    } catch (err) {
      console.error(err)
  
      res.status(403).json({
        status: 'error',
        message: 'failed to verify the token'
      }).end();

      return;
    }
  }
}