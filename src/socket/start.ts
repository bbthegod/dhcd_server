import jwt from 'jsonwebtoken';
import CONST from '../constants/status.js';
import { JWT_SECRET } from '../config/config';
import User from '../api/user/model';

function errorWithMessage(socket, message) {
  socket.emit(CONST.NAMESPACE.AUTH, {
    command: CONST.RETURN.AUTH.LOGIN,
    code: 2,
    message,
  });
  socket.disconnect('unauthorized');
}

function success(socket, user) {
  if (user.role === 'user') {
    socket.broadcast.emit(CONST.NAMESPACE.AUTH, {
      command: CONST.RETURN.AUTH.USER_GO_ONLINE,
      user: {
        username: user.username,
      },
    });
    global.userCount++;
  }
  global.socketList[socket.id] = user._id;
  global.userList[user._id] = socket.id;
  // global.hshIdSocket[socket.id] = socket;
  user.isOnline = true;
  user.save();
  console.log(`${global.userCount} users online now`);
  console.log(`${user.username} is online`);
}

export default function (socket) {
  try {
    return function (data) {
      console.log(data);
      if (data.command === CONST.RECEIVE.LOGIN.AUTH) {
        const { token } = data;
        if (token) {
          jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
              errorWithMessage(socket, 'Authentication failed.');
            } else {
              User.findById(decoded.id, (err, user) => {
                if (err) throw err;
                if (!user) {
                  errorWithMessage(socket, 'Authentication failed.');
                } else if (user) {
                  if (global.userList.hasOwnProperty(user.id)) {
                    errorWithMessage(socket, 'User already online.');
                    return;
                  }
                  success(socket, user);
                }
              });
            }
          });
        } else {
          errorWithMessage(socket, 'Authentication failed.');
        }
      }
    };
  } catch (error) {
    console.log(error);
  }
}
