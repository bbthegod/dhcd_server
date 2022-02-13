import express from 'express';
import user from './api/user/route';
import auth from './api/auth/route';
import question from './api/question/route';
import play from './api/play/route';
import file from './api/file/route';
// GENERATE NEW IMPORT ABOVE, DO NOT DELETE IT

const router = express.Router();
router.get('/health', (req, res) => res.send('OK'));
router.use('/user', user);
router.use('/auth', auth);
router.use('/question', question);
router.use('/play', play);
router.use('/file', file);
// GENERATE NEW ROUTER ABOVE, DO NOT DELETE IT

export default router;
