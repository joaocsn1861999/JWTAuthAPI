import AuthService from '../services/AuthService.js';

class LoginController {

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login(email, password);
      if (!token) {
        return res.status(401).json({
          falha: 'Falha na autenticação'
        });
      };
        
      res.status(200).json({
        message: 'Login realizado com sucesso',
        token: token
      });
    } catch (error) {
        next(error);
    };
  }
};

export default new LoginController();