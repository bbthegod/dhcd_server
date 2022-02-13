import { Schema } from 'mongoose';

interface Play {
  userID: any;
  questions: [
    {
      questionId: any;
      answered: boolean;
      answer: number;
    },
  ];
  totalScore: number;
  isEnded: boolean;
}
