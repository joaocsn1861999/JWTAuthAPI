export default function errorHandler(error, req, res, next) {
  //Para desenvolvimento
  console.error(error);
  
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  return res.status(statusCode).json({
    error: message
  });
}