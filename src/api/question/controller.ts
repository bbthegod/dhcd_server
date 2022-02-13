import httpStatus from 'http-status';
import Question from './model';

export async function load(req, res, next, id) {
  const question = await Question.findById(id);
  if (!question) return res.status(httpStatus.NOT_FOUND).end();
  req.question = question;
  return next();
}

export function get(req, res) {
  return res.json(req.question);
}

export function create(req, res) {
  const { content, options, correctAnswer } = req.body;
  const question = new Question({ content, options, correctAnswer });
  question.save();
  return res.json(question);
}

export function update(req, res) {
  const { content, options, correctAnswer } = req.body;
  const { question } = req;
  question.content = content;
  question.options = options;
  question.correctAnswer = correctAnswer;
  question.save();
  return res.json(question);
}

export async function list(req, res) {
  const { limit = 50, skip = 0, filter, sort } = req.query;
  const questions = await Question.List({ limit, skip, filter, sort });
  return res.json(questions);
}

export function remove(req, res) {
  const { question } = req;
  question.remove();
  return res.json(question);
}
