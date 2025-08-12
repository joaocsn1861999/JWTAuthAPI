export default class LoginController {

  constructor ({authService}) {
    this.authService = authService;
  };

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
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
  };

};