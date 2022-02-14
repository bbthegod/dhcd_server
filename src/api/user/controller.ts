import httpStatus from 'http-status';
import { EndPlay } from '../play/controller';
import Play from '../play/model';
import User from './model';

export async function load(req, res, next, id) {
  const user = await User.findById(id);
  if (!user) return res.status(httpStatus.NOT_FOUND).end();
  req.user = user;
  return next();
}

export function get(req, res) {
  return res.json(req.user);
}

export async function create(req, res, next) {
  const { username, fullname, role, password } = req.body;
  const duplicate = await User.findOne({ username });
  if (duplicate) return res.status(httpStatus.CONFLICT).json('Username already exist');
  const user = new User({ username, fullname, password, role: role || 'user' });
  user.save();
  return res.json(user);
}

export function update(req, res) {
  const { username, fullname, password, role } = req.body;
  const { user } = req;
  user.password = password;
  user.username = username;
  user.fullname = fullname;
  user.role = role;
  user.save();
  return res.json(user);
}

export async function list(req, res) {
  const { limit = 50, skip = 0, filter, sort } = req.query;
  const users = await User.List({ limit, skip, filter, sort });
  return res.json(users);
}

export async function remove(req, res) {
  const { user } = req;
  const play = await Play.findOne({ userID: user.id });
  if (play) play.remove();
  user.remove();
  return res.json(user);
}

export async function resetCheckin(req, res) {
  const users = await User.find({});
  users.forEach((user) => {
    user.isCheckin = false;
    user.save();
  })
  res.status(httpStatus.OK).json({ status: 'ok' });
}

export async function submitCheckin(req, res) {
  const { auth } = req;
  if(auth){
    auth.isCheckin = true;
    auth.save();
    res.status(httpStatus.OK).json({ status: 'ok' });
  }
  res.status(httpStatus.NOT_FOUND).end();
}

export async function submitSurvey(req, res) {
  const { auth } = req;
  const { data } = req.body;
  if(auth.survey.length === 0) {
    auth.survey = data;
    auth.save();
    res.status(httpStatus.OK).json({ status: 'ok' });
  } else{
    res.status(httpStatus.CONFLICT).end();
  }
}
  