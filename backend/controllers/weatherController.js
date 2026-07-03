const weatherService = require('../services/weatherService');
const logger = require('../config/logger');

const getWeather = async (req, res, next) => {
  try {
    const { q } = req.query;
    const weather = await weatherService.getWeather(q);
    res.json({
      success: true,
      data: weather
    });
  } catch (error) {
    logger.error(`Error in getWeather controller: ${error.message}`);
    next(error);
  }
};

module.exports = {
  getWeather
};
