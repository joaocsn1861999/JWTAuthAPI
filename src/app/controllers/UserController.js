export default class UserController {
  
  constructor ({userService, userValidators, isMe}) {
    this.userService = userService;
    this.userValidators = userValidators;
    this.isMe = isMe;
  };
  async index(req, res, next) {
    try {
        let {page, limit, name, active = null, is_admin = null} = req.query;
        page = isNaN(Number(page)) || page < 1 ? 1 : page;
        limit = isNaN(Number(limit)) || limit < 1 ? 5 : limit;
        name = this.userValidators.isValidName(name).isValid ? name : '';
        if (active) {
            active = active.toLowerCase() === 'true' ? true :
                     active.toLowerCase() === 'false' ? false : null;
        };
        if (is_admin) {
            is_admin = is_admin.toLowerCase() === 'true' ? true :
                       is_admin.toLowerCase() === 'false' ? false : null;
        };
        const filters = { name, active, is_admin };

        const result = await this.userService.findAllWithPagination(page, limit, filters);
        return res.status(200).json({
            message: 'Usuários encontrados com sucesso',
            ...result
        });
    } catch (error) {
        next(error);
    };
  };

  async show(req, res, next) {
    try {
        const id = req.params.id;
        const idValidation = this.userValidators.isValidId(id);
        if (!idValidation.isValid) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: idValidation.errors
            });
        };

        const user = await this.userService.findById(id);
        return res.status(200).json({
            message: 'Usuário encontrado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    };
  };

  async count(req, res, next) {
    try {
        const count = await this.userService.countAll();
        return res.status(200).json({
            message: 'Contagem de usuários realizada com sucesso',
            count: count
        });
    } catch (error) {
        next(error);
    };
  };

  async store(req, res, next) {
    try {
        const userValidation = this.userValidators.isValidUserToCreate(req.body);
        if (!userValidation.isValid) {
            return res.status(400).json({
                message: 'Usuário inválido',
                errors: userValidation.errors
            });
        };

        req.body.is_admin = !req.user ? false :
          req.user.is_admin ? req.body.is_admin : false;

        const user = await this.userService.createUser(req.body);
        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    };
  };

  async update(req, res, next) {
    try {
        const userData = req.body;
        const userId = this.isMe ? req.user.id : req.params.id;
        const userValidation = this.userValidators.isValidUserToUpdate({id: userId, ...userData});
        if (!userValidation.isValid) {
            return res.status(400).json({
                message: 'Dados do usuário inválidos',
                errors: userValidation.errors
            });
        };

        if (typeof userData.is_admin === 'boolean' && !req.user.is_admin) {
            return res.status(403).json({
                message: 'Você não tem permissão para alterar o status de administrador'
            });
        };

        const user = await this.userService.updateUser(userData, userId);
        return res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    };
  };

  async changePassword(req, res, next) {
    try {
        const id = req.user.id;
        const {currentPassword, newPassword} = req.body;
        const passwordValidation = this.userValidators.isValidPasswordChange(currentPassword, newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                message: 'Falha ao validar senha',
                errors: passwordValidation.errors
            });
        };

        await this.userService.updatePassword(
            id,
            currentPassword,
            newPassword
        );
        return res.status(200).json({
            message: 'Senha alterada com sucesso'
        });
    } catch (error) {
        next(error);
    };
  };

  async destroy(req, res, next) {
    try {
        const id = this.isMe ? req.user.id : req.params.id;
        const idValidation = this.userValidators.isValidId(id);
        if (!idValidation.isValid) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: idValidation.errors
            });
        };

        await this.userService.deleteUser(id, req.user.id);
        return res.status(200).json({
            message: 'Usuário deletado com sucesso'
        });
    } catch (error) {
        next(error);
    };
  };

};