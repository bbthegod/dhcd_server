import httpStatus from 'http-status';
import User from '../user/model';
const { successResponse, errorResponse } = require('../../utils/response');

export async function login(req, res) {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return errorResponse(res);
  if (user.role === 'admin') {
    let loginResult = await User.Login(user, password);
    if (!loginResult) return errorResponse(res);
  } else {
    if (user.password !== password) return errorResponse(res);
  }
  return successResponse(user, res);
}

export function check(req, res) {
  res.status(httpStatus.OK).end();
}