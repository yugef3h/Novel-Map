import Express from 'express';
import { get } from 'lodash';

// env

const errorhandler: Express.ErrorRequestHandler = (err, req, res, next) => {
  next;
  // respect err.statusCode
  if (err.statusCode) {
    res.statusCode = err.statusCode
  }

  // respect err.status
  if (err.status) {
    res.statusCode = err.status
  }

  // default status code to 500
  if (res.statusCode < 400) {
    res.statusCode = 500;
  }

  if (err.message || err.stack) {
    (global as any).logger.error('request catched by error handler', {
      message: err.message || err,
      stack: JSON.stringify(err.stack),
      cost: Date.now() - get(req, 'headers.x-request-begin'),
    });
  }

  res.json({
    message: err.message,
    error: JSON.stringify(err.stack)
  });
};

export default errorhandler;
