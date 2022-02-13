import { Joi } from 'express-validation';

export default {
  create: {
    body: Joi.object({
      content: Joi.string().required(),
      options: Joi.array().required(),
      correctAnswer: Joi.number().required(),
    }),
  },

  update: {
    body: Joi.object({
      content: Joi.string(),
      options: Joi.array(),
      correctAnswer: Joi.number(),
    }),
    params: Joi.object({ questionId: Joi.string().hex().required() }),
  },
};
