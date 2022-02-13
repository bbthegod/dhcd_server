import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { validate } from 'express-validation';
import validator from './validation';
import * as controller from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file) {
      cb(null, 'public');
    }
  },
  filename(req, file, cb) {
    if (file) {
      cb(null, file.originalname);
    }
  },
});
const upload = multer({ storage });


const updateStorage = multer.diskStorage({
  destination(req, file, cb) {
    if (file) {
      if (fs.existsSync(path.join(__dirname, `../../../public/${req.body.url}`))) {
        fs.unlinkSync(path.join(__dirname, `../../../public/${req.body.url}`));
        cb(null, 'public');
      }
    }
  },
  filename(req, file, cb) {
    if (file) {
      cb(null, file.originalname);
    }
  },
});
const updateUpload = multer({ storage: updateStorage });

router
  .route('/')
  .get(authentication(['admin', 'user', 'delegate']), controller.list)
  .post(authentication(['admin']), upload.single('file'), controller.create);

router
  .route('/:Id')
  .get(authentication(['admin', 'user', 'delegate']), controller.get)
  .put(authentication(['admin']), updateUpload.single('file'), controller.update)
  .delete(authentication(['admin']), controller.remove);

router.param('Id', controller.load);

export default router;
