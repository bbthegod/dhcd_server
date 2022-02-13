import express from 'express';
import * as controller from './controller';
import authentication from '../../middleware/authentication';

const router = express.Router();

router.route('/').get(authentication(['admin']), controller.list);

router.route('/:id').delete(authentication(['admin']), controller.remove);

router.route('/user/:id').get(authentication(['admin', 'user', 'delegate']), controller.getInfo);

router.route('/leaderboard').get(controller.leader);

router.route('/get').get(authentication(['admin', 'user', 'delegate']), controller.GetSingle);

router.route('/end').get(authentication(['admin', 'user', 'delegate']), controller.EndPlay);

router.route('/continue').get(authentication(['admin', 'user', 'delegate']), controller.ContinuePlay);

router.route('/start/quiz').get(authentication(['admin']), controller.startQuiz)

router.route('/clear/quiz').get(authentication(['admin']), controller.clearQuiz)

router.route('/answer/question').post(authentication(['admin', 'user', 'delegate']), controller.AnswerQuestion)

export default router;
