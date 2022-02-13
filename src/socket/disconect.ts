/* eslint-disable consistent-return */
import User from '../api/user/model';
import CONST from '../constants/status';

export default function (socket) {
  return function () {
    if (global.socketList.hasOwnProperty(socket.id)) {
      const query = User.findById(global.socketList[socket.id]);
      query
        .then(user => {
          if (user) {
            console.log(user.username + ' now offline');
            user.isOnline = false;
            if (user.role === 'user') {
              global.userCount--;
            }
            socket.broadcast.emit(CONST.NAMESPACE.AUTH, {
              command: CONST.RETURN.AUTH.DISCONNECT,
              user: {
                username: user.username
              },
            });

            delete global.socketList[socket.id];
            delete global.userList[user.id];
            return user.save();
          }
        })
        .then(() => {
          console.log(global.userCount + ' user online');
        })
        .catch(err => {
          console.log(err);
        });
    }
  };
}
