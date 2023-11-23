import Joi, { type ObjectSchema } from 'joi'

const authSignup = Joi.object().keys({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required()
})

const authSignin = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required()
})

export default {
  '/auth/signup': authSignup,
  '/auth/signin': authSignin
} as Record<string, ObjectSchema>
