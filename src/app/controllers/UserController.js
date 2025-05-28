import UserService from '../services/UserService.js';
import UserValidators from '../utils/validators/UserValidators.js';

class UserController {

  async index(req, res, next) {
    try {
        let {page, limit, name, active = null, is_admin = null} = req.query;
        page = isNaN(Number(page)) || page < 1 ? 1 : page;
        limit = isNaN(Number(limit)) || limit < 1 ? 5 : limit;
        name = UserValidators.isValidName(name).isValid ? name : '';
        if (active) {
            active = active.toLowerCase() === 'true' ? true :
                     active.toLowerCase() === 'false' ? false : null;
        };
        if (is_admin) {
            is_admin = is_admin.toLowerCase() === 'true' ? true :
                       is_admin.toLowerCase() === 'false' ? false : null;
        };
        const filters = { name, active, is_admin };

        const result = await UserService.findAllWithPagination(page, limit, filters);
        return res.status(200).json({
            message: 'Usuários encontrados com sucesso',
            ...result
        });
    } catch (error) {
        next(error);
    }
  }

  async show(req, res, next) {
    try {
        const id = req.params.id;
        const idValidation = UserValidators.isValidId(id);
        if (!idValidation.isValid) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: idValidation.errors
            });
        };

        const user = await UserService.findById(id);
        return res.status(200).json({
            message: 'Usuário encontrado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    }
  }

  async count(req, res, next) {
    try {
        const count = await UserService.countAll();
        return res.status(200).json({
            message: 'Contagem de usuários realizada com sucesso',
            count: count
        });
    } catch (error) {
        next(error);
    }
  }

  async store(req, res, next) {
    try {
        const userValidation = UserValidators.isValidUserToCreate(req.body);
        if (!userValidation.isValid) {
            return res.status(400).json({
                message: 'Usuário inválido',
                errors: userValidation.errors
            });
        };

        req.body.is_admin = !req.user ? false :
          req.user.is_admin ? req.body.is_admin : false;

        const user = await UserService.createUser(req.body);
        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    }
  }

  async update(req, res, next, me) {
    try {
        const userData = req.body;
        const userId = me ? req.user.id : req.params.id;
        const userValidation = UserValidators.isValidUserToUpdate({id: userId, ...userData});
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

        const user = await UserService.updateUser(userData, userId);
        return res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
        const id = req.user.id;
        const {currentPassword, newPassword} = req.body;
        const passwordValidation = UserValidators.isValidPasswordChange(currentPassword, newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                message: 'Falha ao validar senha',
                errors: passwordValidation.errors
            });
        };

        await UserService.updatePassword(
            id,
            currentPassword,
            newPassword
        );
        return res.status(200).json({
            message: 'Senha alterada com sucesso'
        });
    } catch (error) {
        next(error);
    }
  }

  async destroy(req, res, next, me) {
    try {
        const id = me ? req.user.id : req.params.id;
        const idValidation = UserValidators.isValidId(id);
        if (!idValidation.isValid) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: idValidation.errors
            });
        };

        await UserService.deleteUser(id, req.user.id);
        return res.status(200).json({
            message: 'Usuário deletado com sucesso'
        });
    } catch (error) {
        next(error);
    }
  }
}

export default new UserController();