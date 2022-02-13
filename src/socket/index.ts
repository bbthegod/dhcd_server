import CONST from '../constants/status';
import login from './start';
import question from './question';
import disconect from './disconect';

export default function (socket) {
  socket.emit(CONST.NAMESPACE.LOGIN, { message: 'welcome to socket server' });
  socket.on(CONST.NAMESPACE.LOGIN, login(socket));
  socket.on(CONST.NAMESPACE.QUESTION, question(socket));
  socket.on(CONST.NAMESPACE.DISCONNECT, disconect(socket));
}
