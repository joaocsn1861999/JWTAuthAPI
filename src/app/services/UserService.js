import UserRepository from '../repositories/UserRepository.js';
import bcrypt from 'bcrypt';

class UserService {

  async createUser(user) {
    //Criar middleware para fazer a validação
    const hasUpperCase = /[A-Z]/.test(user.password);
    const hasLowerCase = /[a-z]/.test(user.password);
    const hasNumber = /[0-9]/.test(user.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(user.password);
    const hasMinLength = user.password.length >= 8;
    if (!hasMinLength) throw new Error('A senha deve ter pelo menos 8 caracteres');
    if (!hasUpperCase) throw new Error('A senha deve ter pelo menos uma letra maiúscula');
    if (!hasLowerCase) throw new Error('A senha deve ter pelo menos uma letra minúscula');
    if (!hasNumber) throw new Error('A senha deve ter pelo menos um número');
    if (!hasSpecialChar) throw new Error('A senha deve ter pelo menos um caractere especial');
    if (!user.first_name || !user.last_name || !user.email || !user.password) throw new Error('Nome, sobrenome, e-mail e senha são obrigatórios');
    if (user.first_name.length < 3) throw new Error('O nome deve ter pelo menos 3 caracteres');
    if (user.last_name.length < 3) throw new Error('O sobrenome deve ter pelo menos 3 caracteres');
    if (!user.email.includes('@') || !user.email.includes('.') || user.email.length < 5) throw new Error('O e-mail deve ser válido');
    if (user.first_name.length > 50) throw new Error('O nome deve ter no máximo 50 caracteres');
    if (user.last_name.length > 50) throw new Error('O sobrenome deve ter no máximo 50 caracteres');
    if (user.email.length > 100) throw new Error('O e-mail deve ter no máximo 100 caracteres');
    if (user.password.length > 100) throw new Error('A senha deve ter no máximo 100 caracteres');
    
    const userExists = await UserRepository.findByEmailWithPassword(user.email);
    if (userExists) throw new Error('E-mail já está em uso');

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      password: hashedPassword,
      is_admin: user.is_admin || false,
    };

    const result = await UserRepository.create(newUser);
    if (!result) throw new Error('Erro ao criar usuário');

    const userCreated = await UserRepository.findById(result.insertedID);
    if (!userCreated) throw new Error('Erro ao buscar usuário criado');

    return userCreated;
  };

  async findAllWithPagination(name, page, limit) {
    name = name.trim().length > 2 ? name.trim() : '';
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 5;
    const offset = (page - 1) * limit;
    const users = await UserRepository.findAllWithPagination( name, limit, offset );
    if (!users) throw new Error('Erro ao buscar usuários com paginação');

    const total = await UserRepository.count(name);
    if (!total) throw new Error('Erro ao contar usuários');

    return {
      users: users,
      total: total,
    };
  };
  
  async findById(id) {
    //Criar middleware para fazer a validação
    if (!isNaN(id)) throw new Error('ID do usuário é obrigatório');

    const user = await UserRepository.findById(id);
    if (!user) throw new Error('Usuário não encontrado');

    return user;
  };

  async updateUser(user, id) {
    //Criar middleware para fazer a validação
    if (!isNaN(id)) throw new Error('ID do usuário é obrigatório');
    if (!user.first_name || !user.last_name || !user.email) throw new Error('Nome, sobrenome e e-mail são obrigatórios');
    
    const result = await UserRepository.update(user, id);
    if (!result) throw new Error('Erro ao atualizar usuário');

    const updatedUser = await UserRepository.findById(id);
    if (!updatedUser) throw new Error('Erro ao buscar usuário atualizado');

    return updatedUser;
  };

  async updatePassword(id, currentPassword, newPassword) {
    //criar middleware para fazer a validação
    if (!isNaN(id)) throw new Error('ID do usuário é obrigatório');
    if (!currentPassword || !newPassword) throw new Error('Senha atual e nova senha são obrigatórias');
    if (currentPassword === newPassword) throw new Error('A nova senha não pode ser igual à senha atual');
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const hasMinLength = newPassword.length >= 8;
    if (!hasMinLength) throw new Error('A senha deve ter pelo menos 8 caracteres');
    if (!hasUpperCase) throw new Error('A senha deve ter pelo menos uma letra maiúscula');
    if (!hasLowerCase) throw new Error('A senha deve ter pelo menos uma letra minúscula');
    if (!hasNumber) throw new Error('A senha deve ter pelo menos um número');
    if (!hasSpecialChar) throw new Error('A senha deve ter pelo menos um caractere especial');
    
    
    const user = await UserRepository.findByIdWithPassword(id);
    if (!user) throw new Error('Usuário não encontrado');

    const sendedHashedPassword = currentPassword;
    const passwordsMatch = await bcrypt.compare(user.password, sendedHashedPassword);
    if (!passwordsMatch) throw new Error('Senha atual incorreta');
    
    const newHashPassword = await bcrypt.hash(newPassword, 10);
    const result = await UserRepository.updatePassword(newHashPassword, id);    
    if (!result) throw new Error('Erro ao atualizar senha');

    return result;
  };

  async deleteUser(id, deletedBy) {
    //Criar middleware para fazer a validação
    if (!isNaN(id)) throw new Error('ID do usuário é obrigatório');
    if (!deletedBy) throw new Error('ID do usuário que está deletando é obrigatório');
    
    const result = await UserRepository.softDelete(id, deletedBy);
    if (!result) throw new Error('Erro ao deletar usuário');

    return result;
  };

}

export default new UserService();
