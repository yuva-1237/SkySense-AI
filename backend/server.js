const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

const server = app.listen(config.port, () => {
  logger.info(`SkySense Backend listening on port ${config.port} in ${config.env} mode`);
});

process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Shutting down...');
  logger.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated!');
  });
});
