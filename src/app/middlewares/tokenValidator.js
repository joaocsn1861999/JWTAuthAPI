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
    req.user = {
      id: decoded.id,
      is_admin: decoded.is_admin
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Token inválido",
    });
  }
}
