const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');
const requestValidator = require('../middleware/requestValidator');
const { weatherQuerySchema } = require('../models/validationSchemas');

router.get('/', requestValidator(weatherQuerySchema, 'query'), weatherController.getWeather);

module.exports = router;
