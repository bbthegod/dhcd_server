import http from 'http';
import app from './config/express';
import './config/mongoose';
import { PORT, ENVIRONMENT, ALLOWED_IP } from './config/config';
import socketMain from './socket';

const server = http.createServer(app);

global.io = require('socket.io')(server, {
  transports: ['websocket', 'polling'],
  cors: {
    origin: ALLOWED_IP,
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
});

global.socketList = {};
global.userList = {};
global.userCount = 0;

if (!module.parent) {
  server.listen(PORT, () => {
    console.log('\x1b[33m%s\x1b[0m', `Server started on port ${PORT} (${ENVIRONMENT} mode)`);
    global.io.on('connection', socket => socketMain(socket));
  });
}

export default app;
