import httpStatus from 'http-status';
import User from '../user/model';
import Question from '../question/model';
import Play from './model';

export async function list(req, res) {
  const { limit = 50, skip = 0, filter, sort } = req.query;
  const plays = await Play.List({ limit, skip, filter, sort });
  return res.json(plays);
}

export async function remove(req, res) {
  const { id } = req.params;
  const play = await Play.findOne({ userID: id });
  if (!play) return res.status(httpStatus.NOT_FOUND).end();
  play.remove();
  return res.json(play);
}

export async function getInfo(req, res) {
  const { id } = req.params;
  const play = await Play.findOne({ userID: id })
    .populate({
      path: 'userID',
      select: 'username fullname',
      populate: [{ path: '_id', select: 'content' }],
    })
    .populate({
      path: 'questions.questionId',
      select: '-correctAnswer',
    });
  return res.json(play);
}

export async function GetSingle(req, res) {
  const { username } = req.auth;
  const user = await User.findOne({ username });
  if (!user) return res.status(httpStatus.NOT_FOUND).end();
  const play = await Play.findOne({ userID: user._id }, { createdAt: 0, updatedAt: 0, __v: 0 });
  if (!play) return res.status(httpStatus.NOT_FOUND).end();
  return res.json(play);
}

export async function EndPlay(req, res) {
  const { username } = req.auth;
  if (username) {
    const user = await User.findOne({ username });
    if (!user) return res.status(httpStatus.NOT_FOUND);
    if (user && user.role === 'user') {
      const play = await Play.findOne({ userID: user._id });
      if (!play) return res.status(httpStatus.NOT_FOUND).end();
      play.isEnded = true;
      return play.save().then(async result => {
        const r = await result.populate('questions.questionId', 'options content');
        res.status(httpStatus.OK).json(r);
      });
    }
  }
}

export async function ContinuePlay(req, res) {
  const { username } = req.auth;
  if (username) {
    const user = await User.findOne({ username });
    if (!user) return res.status(httpStatus.NOT_FOUND);
    if (user && user.role !== 'admin') {
      const play = await Play.findOne({ userID: user._id }, { createdAt: 0, updatedAt: 0, __v: 0 }).populate(
        'questions.questionId',
        'options content',
      );
      if (play) return res.status(httpStatus.OK).json(play);
      return res.status(httpStatus.NOT_FOUND).end();
    }
  }
}

export async function leader(req, res) {
  const newPlay = await Play.aggregate()
    .project({
      userID: 1,
      totalScore: 1,
      isInterviewed: 1,
      comment: 1,
    })
    .sort('-totalScore');
  await Play.populate(newPlay, { path: 'userID', select: { username: 1, fullname: 1 } });
  res.json(newPlay);
}

export async function startQuiz(req, res) {
  const users = await User.find({});
  users.forEach(async (user) => {
    if (user && user.role === 'user') {
      const play = await Play.findOne({ userID: user._id });
      if (!play) {
        const newPlay = new Play({
          userID: user._id,
          questions: await Question.random(),
          timeOut: new Date(Date.now() + 20 * 60000),
        });
        newPlay.save();
      }
    }
  })
  res.status(httpStatus.OK).json({ status: 'ok' });
}

export async function clearQuiz(req, res) {
  const plays = await Play.find();
  plays.forEach((play) => {
    play.remove();
  })
  res.status(httpStatus.OK).json({ status: 'ok' });
}

async function scoreCaculation(play) {
  const result = await Play.findById(play._id).populate('questions.questionId');
  if (result) {
    let score = 0;
    for (let i = 0; i < play.questions.length; i++) {
      if (play.questions[i].answer === result.questions[i].questionId.correctAnswer) {
        score += 20;
      }
    }
    result.totalScore = score;
    result.save();
    return result;
  }
}

export async function AnswerQuestion(req, res) {
  const user = req.auth;
  const { index, numbering } = req.body;
  if (user) {
    const play = await Play.findOne({ userID: user._id })
    if (play) {
      play.questions[index].answer = +numbering;
      play.questions[index].answered = true;
      play.save();
      await scoreCaculation(play);
      return res.json(play)
    }
  }
  res.status(httpStatus.NOT_FOUND).end();
}