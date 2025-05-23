export default function adminUserCheck(req, res, next) {
  if (!req.user.is_admin)
    return res.status(401).json({
      message: "Você não tem permissão para acessar este recurso",
    });
  next();
}
