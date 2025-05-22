import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserRepository from '../repositories/UserRepository.js';
import AppError from '../utils/AppError.js';

dotenv.config({ path: './.env' });

class AuthService {
  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        is_admin: user.is_admin,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );
  }

  async login(email, password) {
    const user = await UserRepository.findByEmailWithPassword(email);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    if (!user.active) throw new AppError('Usuário inativo', 403);

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new AppError('Senha incorreta', 401);

    return this.generateAccessToken(user);
  }
}

export default new AuthService();
