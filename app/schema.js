const Joi = require('joi')

const schema = Joi.object({
  host: Joi.string().required(),
  user: Joi.string().required(),
  password: Joi.string().required(),
  port: Joi.number().required(),
  database: Joi.string().required(),
})

module.exports = { schema }