import UserService from '../services/UserService.js';

class UserController {

  async index(req, res) {
    try {
        const result = await UserService.findAllWithPagination(
            req.query.name,
            req.query.page,
            req.query.limit
        );
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
        const user = await UserService.updateUser(req.body, req.params.id);
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
        await UserService.updatePassword(
            req.params.id,
            req.body.currentPassword,
            req.body.newPassword
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
        // userId provisório, deve vir do token
        // req.user.id
        await UserService.deleteUser(req.params.id, 1);
        return res.status(200).json({
            message: 'Usuário deletado com sucesso'
        });
    } catch (error) {
        next(error);
    }
  }
}

export default new UserController();