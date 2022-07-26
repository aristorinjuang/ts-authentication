require('dotenv').config();

import Repository from '../../repository/Repository';
import { Router, Request, Response } from 'express';
import { body, validationResult, Result, ValidationError } from 'express-validator';
import Email from '../../valueobject/Email';
import Password from '../../valueobject/Password';
import Name from '../../valueobject/Name';
import User from '../../entity/User';
import jwt from 'jsonwebtoken';
import JSON from '../../factory/JSON';
import Middleware from './Middleware';

export default (repository: Repository): Router => {
  const router: Router = Router();

  router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    async (req: Request, res: Response): Promise<void> => {
      let errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: errors.array(),
        }).end()

        return;
      }

      let email: Email = new Email(req.body.email);

      try {
        let user: User = await repository.get(email);

        if (user.password.verify(req.body.password)) {
          res.status(200).json({
            status: 'success',
            data: {
              access_token: jwt.sign(
                JSON.user(user),
                String(process.env.ACCESS_TOKEN_SECRET),
                {
                  expiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN)
                }
              ),
              refresh_token: jwt.sign(
                JSON.user(user),
                String(process.env.REFRESH_TOKEN_SECRET)
              )
            }
          }).end();

          return;
        }

        res.status(404).json({
          status: 'fail',
          message: 'user not found'
        }).end();
      } catch (err) {
        console.error(err);

        res.status(500).json({
          status: 'error',
          message: 'failed to login'
        }).end();
      }
    }
  )

  router.post(
    '/register',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    async (req: Request, res: Response): Promise<void> => {
      let errors: Result<ValidationError> = validationResult(req);

      if (!errors.isEmpty()) {
        res.status(400).json({
          status: 'error',
          message: errors.array(),
        }).end()

        return;
      }

      if (req.body.first_name === undefined || req.body.first_name === '') {
        res.status(400).json({
          status: 'error',
          message: 'first name should not be empty',
        }).end()

        return;
      }

      let email: Email = new Email(req.body.email);
      let name: Name = new Name(req.body.first_name, req.body.last_name);
      let password: Password = new Password();

      password.hash = req.body.password;

      let user: User = new User(email, name, password)

      try {
        await repository.create(user);

        res.status(200).json({
          status: 'success',
        }).end();
      } catch (err) {
        console.error(err);

        res.status(500).json({
          status: 'error',
          message: 'failed to register'
        }).end();
      }
    }
  )

  router.post(
    '/token',
    async (req: Request, res: Response): Promise<void> => {
      try {
        let user = jwt.verify(
          req.body.token,
          String(process.env.REFRESH_TOKEN_SECRET)
        )

        res.status(200).json({
          status: 'success',
          data: {
            access_token: jwt.sign(
              user,
              String(process.env.ACCESS_TOKEN_SECRET),
              {
                expiresIn: String(process.env.ACCESS_TOKEN_EXPIRES_IN)
              }
            )
          }
        }).end();
      } catch (err) {
        res.status(403).json({
          status: 'error',
          message: 'failed to refresh token'
        }).end();

        return;
      }
    }
  )

  router.get(
    '/me',
    Middleware.authentication,
    async (_: Request, res: Response): Promise<void> => {
      res.status(200).json({
        status: 'success',
        data: {
          user: res.locals.user
        }
      }).end();
    }
  )

  return router;
}