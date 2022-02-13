import { Joi } from 'express-validation';

export default {
  create: {
    body: Joi.object({
      studentCode: Joi.string().required(),
      studentName: Joi.string().required(),
      studentClass: Joi.string().required(),
      studentPhone: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },

  update: {
    body: Joi.object({
      studentCode: Joi.string().required(),
      studentName: Joi.string().required(),
      studentClass: Joi.string().required(),
      studentPhone: Joi.string().required(),
    }),
    params: { userId: Joi.string().hex().required() },
  },
};
