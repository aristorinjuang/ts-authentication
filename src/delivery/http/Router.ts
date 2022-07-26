import { Router } from 'express';

export default (handler: Router): Router => {
  const router: Router = Router();

  router.use('/', handler)

  return router;
}