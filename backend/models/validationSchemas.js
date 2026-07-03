const Joi = require('joi');

const weatherQuerySchema = Joi.object({
  q: Joi.string().min(2).required().messages({
    'string.empty': 'Search location query cannot be empty',
    'string.min': 'Search location query must be at least 2 characters long',
    'any.required': 'Search location query is required'
  })
});

const chatbotBodySchema = Joi.object({
  message: Joi.string().min(1).required().messages({
    'string.empty': 'Chat message cannot be empty',
    'any.required': 'Chat message is required'
  }),
  sessionId: Joi.string().guid({ version: 'uuidv4' }).allow(null).optional().messages({
    'string.guid': 'Session ID must be a valid UUIDv4'
  }),
  location: Joi.string().allow('').optional()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  name: Joi.string().min(2).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'any.required': 'Name is required'
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).optional(),
  avatar: Joi.string().uri().allow('').optional(),
  password: Joi.string().min(6).optional(),
  preferences: Joi.object({
    unit: Joi.string().valid('c', 'f').optional(),
    defaultCity: Joi.string().allow('').optional(),
    notifications: Joi.boolean().optional()
  }).optional()
});

const saveLocationSchema = Joi.object({
  name: Joi.string().required(),
  lat: Joi.number().required(),
  lon: Joi.number().required(),
  country: Joi.string().allow('').optional()
});

module.exports = {
  weatherQuerySchema,
  chatbotBodySchema,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  saveLocationSchema
};
