import UserService from '../services/UserService.js';
import UserValidators from '../utils/validators/UserValidators.js';

class UserController {

  async index(req, res) {
    try {
        const name = typeof req.query.name === 'string' ? name : '';
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const result = await UserService.findAllWithPagination(name, page, limit);
        return res.status(200).json({
            message: 'Usuários encontrados com sucesso',
            ...result
        });
    } catch (error) {
        next(error);
    }
  }

  async show(req, res) {
    try {
        const idValidation = UserValidators.isValidId(req.params.id);
        if (!idValidation.isValid) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: idValidation.errors
            });
        }

        const user = await UserService.findById(req.params.id);
        return res.status(200).json({
            message: 'Usuário encontrado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    }
  }

  async store(req, res) {
    try {
        const userValidation = UserValidators.isValidUserToCreate(req.body);
        if (!userValidation.isValid) {
            return res.status(400).json({
                message: 'Usuário inválido',
                errors: userValidation.errors
            });
        }

        const user = await UserService.createUser(req.body);
        return res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    }
  }

  async update(req, res) {
    try {
        const userData = req.body;
        const userId = req.params.id;
        const userValidation = UserValidators.isValidUserToUpdate({userId, ...userData});
        if (!userValidation.isValid) {
            return res.status(400).json({
                message: 'Dados do usuário inválidos',
                errors: userValidation.errors
            });
        }

        const user = await UserService.updateUser(userData, userId);
        return res.status(200).json({
            message: 'Usuário atualizado com sucesso',
            user: user
        });
    } catch (error) {
        next(error);
    }
  }

  async changePassword(req, res) {
    try {
        const id = req.user.id;
        const {currentPassword, newPassword} = req.body;
        const passwordValidation = UserValidators.isValidPasswordChange(currentPassword, newPassword);
        if (!passwordValidation.isValid) {
            return res.status(400).json({
                message: 'Falha ao validar senha',
                errors: passwordValidation.errors
            });
        }

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

  async destroy(req, res) {
    try {
        const id = req.params.id;
        const idValidation = UserValidators.isValidId(id);
        if (!idValidation.isValid) {
            return res.status(400).json({
                message: 'ID inválido',
                errors: idValidation.errors
            });
        }

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