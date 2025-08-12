import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';

export default class AuthService {

  constructor ({userRepository, jwtSecret, jwtExpiration}) {
    this.userRepository = userRepository;
    this.jwtSecret = jwtSecret;
    this.jwtExpiration = jwtExpiration;
  };

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        is_admin: user.is_admin,
      },
      jwtSecret,
      { expiresIn: jwtExpiration }
    );
  };

  async login(email, password) {
    const user = await userRepository.findByEmailWithPassword(email);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    if (!user.active) throw new AppError('Usuário inativo', 403);

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new AppError('Senha incorreta', 401);

    return this.generateAccessToken(user);
  };

};