import Repository from '../../repository/Repository';
import express, { Express, Router as ExpressRouter } from 'express';
import Router from './Router';
import Handler from './Handler';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import sinon from 'sinon';
import Middleware from './Middleware';
import User from '../../entity/User';
import Email from '../../valueobject/Email';
import Name from '../../valueobject/Name';
import Password from '../../valueobject/Password';

describe('HTTP handler', () => {
  describe('resolved handler', () => {
    const password: Password = new Password('$2b$10$WCZ6j4PLICecyCYvBvL7We')
    password.hash = 'password'
  
    const repository: Repository = {
      get: jest.fn().mockReturnValue(new User(
        new Email('test@example.com'),
        new Name('John', 'Doe'),
        password,
      )),
      create: jest.fn().mockResolvedValueOnce(() => Promise.resolve()),
    };
    const router: ExpressRouter = Router(Handler(repository));
    const app: Express = express();

    app.use(express.json());
    app.use('/', router);

    test('POST /register 200', async () => {
      const data = {
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe'
      }
      const res = await request(app).post('/register').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
    })

    test('POST /register 400', async () => {
      const res = await request(app).post('/register');
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
    })

    test('POST /register 400 with no first name', async () => {
      const data = {
        email: 'test@example.com',
        password: 'password'
      }
      const res = await request(app).post('/register').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('first name should not be empty');
    })
  
    test('POST /login 200', async () => {
      const data = {
        email: 'test@example.com',
        password: 'password'
      }
      const res = await request(app).post('/login').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.access_token).toBeDefined();
      expect(res.body.data.refresh_token).toBeDefined();
    })
  
    test('POST /login 400', async () => {
      const res = await request(app).post('/login');
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBeDefined();
    })

    test('POST /login 404', async () => {
      const data = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }
      const res = await request(app).post('/login').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('fail');
      expect(res.body.message).toBe('user not found');
    })
  
    test('POST /token 200', async () => {
      sinon.stub(jwt, 'verify');
      sinon.stub(jwt, 'sign').callsFake(() => {
        return '';
      });
  
      const data = {
        token: 'token'
      }
      const res = await request(app).post('/token').send(data);
  
      sinon.restore();
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.access_token).toBeDefined();
    })
  
    test('GET /me 200', async () => {
      sinon.stub(jwt, 'verify');
  
      const res = await request(app).get('/me');
  
      sinon.restore();
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeDefined();
    })

    test('GET /me 403', async () => {
      sinon.stub(Middleware, 'authentication').rejects();

      const res = await request(app).get('/me');

      sinon.restore();
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('failed to verify the token');
    })
  })

  describe('rejected handler', () => {
    const repository: Repository = {
      get: jest.fn().mockRejectedValueOnce(() => Promise.reject(new Error('failed to get a user'))),
      create: jest.fn().mockRejectedValueOnce(() => Promise.reject(new Error('failed to create a user'))),
    };
    const router: ExpressRouter = Router(Handler(repository));
    const app: Express = express();

    app.use(express.json());
    app.use('/', router);

    test('POST /login 500', async () => {
      const data = {
        email: 'test@example.com',
        password: 'password'
      }
      const res = await request(app).post('/login').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('failed to login');
    })

    test('POST /register 500', async () => {
      const data = {
        email: 'test@example.com',
        password: 'password',
        first_name: 'John',
        last_name: 'Doe'
      }
      const res = await request(app).post('/register').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('failed to register');
    })

    test('POST /token 403', async () => {
      const data = {
        token: 'token'
      }
      const res = await request(app).post('/token').send(data);
  
      expect(res.header['content-type']).toBe('application/json; charset=utf-8');
      expect(res.statusCode).toBe(403);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toBe('failed to refresh token');
    })
  })
})