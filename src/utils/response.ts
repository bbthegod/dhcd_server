import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { JWT_SECRET } from '../config/config';

export function successResponse(user, res) {
  const token = jwt.sign({ id: user.id, username: user.username, fullname: user.fullname}, JWT_SECRET);
  res.status(httpStatus.OK).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      role: user.role,
    },
  });
}

export function errorResponse(res) {
  return res.status(httpStatus.UNAUTHORIZED).json('UNAUTHORIZED');
}
