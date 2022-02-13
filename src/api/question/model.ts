const _ = require('lodash');
import { Model, Schema, model } from 'mongoose';

interface QuestionModel extends Model<Question> {
  List(filter: { limit: number; skip: number; filter: object; sort: string }): any;
  random(): any;
}

const questionSchema = new Schema<Question, QuestionModel>(
  {
    content: { type: String, required: true },
    options: [
      {
        numbering: { type: Number, required: true },
        answer: { type: String, required: true },
      },
    ],
    correctAnswer: { type: Number, required: true },
  },
  { collection: 'questions', timestamps: true },
);

questionSchema.statics.List = async function ({ skip = 0, limit = 500, sort = { createdAt: -1 }, filter = {} }) {
  const data = await this.find(filter, { createdAt: 0, updatedAt: 0, password: 0 })
    .sort(sort)
    .skip(+skip)
    .limit(+limit)
    .exec();
  const count = await this.find(filter).count();
  return { data, count, limit, skip };
};

questionSchema.statics.random = async function () {
  const allQuestions = await this.find();
  const returnQuestions: any = [];
  if (allQuestions) {
    await _.shuffle(allQuestions)
      .slice(0, 20)
      .map(item => returnQuestions.push({ questionId: item._id, answer: false }));
    return returnQuestions;
  }
  return null;
};

export default model('Question', questionSchema);
