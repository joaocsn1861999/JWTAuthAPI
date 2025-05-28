import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export default function tokenValidator(req, res, next) {
  const token = req.headers["authorization"];
  if (!token)
    return res.status(401).json({
      message: "Token não fornecido",
    });

  try {
    const decoded = jwt.verify(
      token.split(" ")[1],
      process.env.JWT_SECRET
    );

    const isAdmin = decoded.is_admin === 1 ? true : false;
    req.user = {
      id: decoded.id,
      is_admin: isAdmin
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token inválido",
    });
  }
}
