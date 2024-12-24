const { constants } = require ('http2');

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;