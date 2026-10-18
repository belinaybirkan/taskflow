const HttpError = require('../utils/HttpError');

function notFound(req, _res, next) {
  next(new HttpError(404, 'Endpoint bulunamadı: ' + req.method + ' ' + req.originalUrl));
}

function errorHandler(err, _req, res, _next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Geçersiz JSON.' });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'İstek gövdesi çok büyük.' });
  }
  const status = err instanceof HttpError ? err.status : 500;
  if (status === 500) console.error(err);
  return res.status(status).json({
    error: status === 500 ? 'Beklenmeyen sunucu hatası.' : err.message
  });
}

module.exports = { notFound, errorHandler };
