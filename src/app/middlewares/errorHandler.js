export default function errorHandler(error, req, res, next) {
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    error: message
  });
}