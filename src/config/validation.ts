import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production'),

  PORT: Joi.number().default(3000),
  API_KEY: Joi.string().required(),
  PREFIX: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),

  // DATABASE_USER: Joi.string().required(),
  // DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_URI: Joi.string().required(),

  DEFAULT_USER_NAME: Joi.string().required(),
  DEFAULT_USER_ROLE: Joi.string().required(),
  DEFAULT_USER_EMAIL: Joi.string().required(),
  DEFAULT_USER_PASSWORD: Joi.string().required(),
});
