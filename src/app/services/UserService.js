import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';

class UserService {

  async createUser(user) {
    const userExists = await UserRepository.findByEmailWithPassword(user.email);
    if (userExists) throw new AppError('E-mail já está em uso', 409);

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: hashedPassword,
      is_admin: user.is_admin || false,
    };

    const result = await UserRepository.create(newUser);
    if (!result) throw new AppError('Erro ao criar usuário', 500);

    const userCreated = await UserRepository.findById(result.insertedID);
    if (!userCreated) throw new AppError('Erro ao buscar usuário criado', 500);

    return userCreated;
  };

  async findAllWithPagination(name, page, limit) {
    const offset = (page - 1) * limit;
    const users = await UserRepository.findAllWithPagination( name, limit, offset );
    if (!users || users.length === 0) throw new AppError('Erro ao buscar usuários com paginação', 500);

    const countResult = await UserRepository.count(name);
    if (!countResult.total || countResult.total === 0) throw new AppError('Erro ao contar usuários', 500);

    return {
      users: users,
      pagination: {
        total: countResult.total,
        pages: Math.ceil(countResult.total / limit),
        current_page: page,
        limit: limit,
      },
    };
  };
  
  async findById(id) {
    const user = await UserRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    return user;
  };

  async updateUser(user, id) {
    const result = await UserRepository.update(user, id);
    if (!result) throw new AppError('Erro ao atualizar usuário', 500);

    const updatedUser = await UserRepository.findById(id);
    if (!updatedUser) throw new AppError('Erro ao buscar usuário atualizado', 500);

    return updatedUser;
  };

  async updatePassword(id, currentPassword, newPassword) {    
    const user = await UserRepository.findByIdWithPassword(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);
    
    const passwordsMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordsMatch) throw new AppError('Senha atual incorreta', 401);
    
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    const result = await UserRepository.updatePassword(newHashPassword, id);    
    if (!result) throw new AppError('Erro ao atualizar senha', 500);
    
    return;
  };

  async deleteUser(id, deletedBy) {    
    const result = await UserRepository.softDelete(id, deletedBy);
    if (!result) throw new AppError('Erro ao deletar usuário', 500);

    return;
  };

}

export default new UserService();
