import express from 'express';
import { validate } from 'express-validation';
import validator from './validation';
import * as controller from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router
  .route('/')
  .get(authentication(['admin', 'user']), controller.list)
  .post(authentication(['admin', 'user']), controller.create);

router
  .route('/:Id')
  .get(authentication(['admin', 'user']), controller.get)
  .put(authentication(['admin', 'user']), controller.update)
  .delete(authentication(['admin', 'user']), controller.remove);

router.param('Id', controller.load);

export default router;
