import jwt from 'jsonwebtoken';
import Play from '../api/play/model';
import { JWT_SECRET } from '../config/config';
import STATUS from '../constants/status';

interface Token {
  id: string;
  username: string;
}

async function scoreCaculation(play) {
  const result = await Play.findById(play._id).populate('questions.questionId');
  if (result) {
    let score = 0;
    for (let i = 0; i < play.questions.length; i++) {
      if (play.questions[i].answer === result.questions[i].questionId.correctAnswer) {
        score += 10;
      }
    }
    result.totalScore = score;
    result.save();
    return result;
  }
}

export default function (socket) {
  return async function (data) {
    console.log('12312312312', data);
    try {
      const key: any = await jwt.verify(data.token, JWT_SECRET);
      if (key) {
        switch (data.command) {
          case STATUS.QUESTION.ANSWER: {
            if (data.data.answer !== undefined) {
              Play.findOne({ userID: key.id })
                .then(async player => {
                  if (player) {
                    player.questions[data.data.index].answer = +data.data.answer;
                    player.questions[data.data.index].answered = true;
                    player.save();
                    await scoreCaculation(player);
                  }
                })
                .catch(() => {
                  socket.emit(STATUS.NAMESPACE.ERROR, 'Error');
                });
            }
            break;
          }
        }
      }
    } catch (e) {
      socket.emit(STATUS.NAMESPACE.ERROR, 'Error');
    }
  };
}
