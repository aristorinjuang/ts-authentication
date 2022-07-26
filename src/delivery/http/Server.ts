require('dotenv').config()

import express, { Express, Router } from 'express';

export default class Server {
  private _router: Router;

  constructor(router: Router) {
    this._router = router;
  }

  public run(port: number): void {
    const app: Express = express();

    app.use(express.json())
    app.use((_, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', String(process.env.ORIGINS));
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'content-type');

      next();
    });
    app.use('/', this._router)
    app.listen(port, () => {
      console.log(`The HTTP server is running on port ${port}.`);
    })
  }
}