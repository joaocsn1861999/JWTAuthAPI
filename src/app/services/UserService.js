import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';
import AppError from '../utils/AppError.js';

class UserService {

  async createUser(user) {
    //Criar middleware para fazer a validação
    const hasUpperCase = /[A-Z]/.test(user.password);
    const hasLowerCase = /[a-z]/.test(user.password);
    const hasNumber = /[0-9]/.test(user.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(user.password);
    const hasMinLength = user.password.length >= 8;
    if (!hasMinLength) throw new AppError('A senha deve ter pelo menos 8 caracteres');
    if (!hasUpperCase) throw new AppError('A senha deve ter pelo menos uma letra maiúscula');
    if (!hasLowerCase) throw new AppError('A senha deve ter pelo menos uma letra minúscula');
    if (!hasNumber) throw new AppError('A senha deve ter pelo menos um número');
    if (!hasSpecialChar) throw new AppError('A senha deve ter pelo menos um caractere especial');
    if (!user.first_name || !user.last_name || !user.email || !user.password) throw new AppError('Nome, sobrenome, e-mail e senha são obrigatórios');
    if (user.first_name.length < 3) throw new AppError('O nome deve ter pelo menos 3 caracteres');
    if (user.last_name.length < 3) throw new AppError('O sobrenome deve ter pelo menos 3 caracteres');
    if (!user.email.includes('@') || !user.email.includes('.') || user.email.length < 5) throw new AppError('O e-mail deve ser válido');
    if (user.first_name.length > 50) throw new AppError('O nome deve ter no máximo 50 caracteres');
    if (user.last_name.length > 50) throw new AppError('O sobrenome deve ter no máximo 50 caracteres');
    if (user.email.length > 100) throw new AppError('O e-mail deve ter no máximo 100 caracteres');
    if (user.password.length > 100) throw new AppError('A senha deve ter no máximo 100 caracteres');
    
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
    //Criar middleware para fazer a validação
    name = typeof name === 'string' ? name : '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;

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
    //Criar middleware para fazer a validação
    if (isNaN(Number(id)) || Number(id) <= 0) throw new AppError('ID do usuário é obrigatório');

    const user = await UserRepository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado', 404);

    return user;
  };

  async updateUser(user, id) {
    //Criar middleware para fazer a validação
    if (isNaN(Number(id)) || Number(id) <= 0) throw new AppError('ID do usuário é obrigatório');
    if (!user.first_name && !user.last_name && !user.email) throw new AppError('Nome, sobrenome e e-mail são obrigatórios');
    if (user.password) throw new AppError('A senha não pode ser atualizada aqui');
    
    const result = await UserRepository.update(user, id);
    if (!result) throw new AppError('Erro ao atualizar usuário', 500);

    const updatedUser = await UserRepository.findById(id);
    if (!updatedUser) throw new AppError('Erro ao buscar usuário atualizado', 500);

    return updatedUser;
  };

  async updatePassword(id, currentPassword, newPassword) {
    //criar middleware para fazer a validação
    if (isNaN(Number(id)) || Number(id) <= 0) throw new AppError('ID do usuário é obrigatório');
    if (!currentPassword || !newPassword) throw new AppError('Senha atual e nova senha são obrigatórias');
    if (currentPassword === newPassword) throw new AppError('A nova senha não pode ser igual à senha atual');
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasMinLength = newPassword.length >= 8;
    if (!hasMinLength) throw new AppError('A senha deve ter pelo menos 8 caracteres');
    if (!hasUpperCase) throw new AppError('A senha deve ter pelo menos uma letra maiúscula');
    if (!hasLowerCase) throw new AppError('A senha deve ter pelo menos uma letra minúscula');
    if (!hasNumber) throw new AppError('A senha deve ter pelo menos um número');
    if (!hasSpecialChar) throw new AppError('A senha deve ter pelo menos um caractere especial');
    
    
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
    //Criar middleware para fazer a validação
    if (isNaN(Number(id)) || Number(id) <= 0) throw new AppError('ID do usuário é obrigatório');
    if (!deletedBy) throw new AppError('ID do usuário que está deletando é obrigatório');
    
    const result = await UserRepository.softDelete(id, deletedBy);
    if (!result) throw new AppError('Erro ao deletar usuário', 500);

    return;
  };

}

export default new UserService();
