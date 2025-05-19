import db from '../database/connection.js';
import DBAsyncHelpers from '../database/helpers/DBAsyncHelpers.js';
import buildInsertQuery from '../database/helpers/buildInsertQuery.js';

class UsersRepository {

  async create(user) {
    const userData = buildInsertQuery(user);
    const sql = `
      INSERT
      INTO users (${userData.fields})
      VALUES (${userData.placeholders})
    `;

    return DBAsyncHelpers.run({
      db,
      sql,
      params: userData.values,
      rejectMessage: 'Erro ao criar usuário',
    });
  }

  async findAllWithPagination(name, limit, offset) {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        is_admin,
        active,
        created_at,
        updated_at
      FROM users 
      WHERE deleted = FALSE 
      AND first_name LIKE ?
      LIMIT ? 
      OFFSET ?;
    `;
    const nameFilter = `%${name}%`;
    return DBAsyncHelpers.all({
      db,
      sql,
      params: [nameFilter, limit, offset],
      rejectMessage: 'Erro ao buscar usuários com paginação',
    });
  }

  async count(name) {
    const sql = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE deleted = FALSE
      AND first_name LIKE ?;
    `;
    const nameFilter = `%${name}%`;
    return DBAsyncHelpers.get({
      db,
      sql,
      params: [nameFilter],
      rejectMessage: 'Erro ao contar usuários',
    });
  }

  async findById(id) {
    const sql = `
      SELECT
        id,
        first_name,
        last_name,
        email,
        is_admin,
        active,
        created_at,
        updated_at
      FROM users 
      WHERE id = ?
      AND deleted = FALSE;
    `;
    return DBAsyncHelpers.get({
      db,
      sql,
      params: [id],
      rejectMessage: 'Erro ao buscar usuário por ID',
    });
  }

  async findByIdWithPassword(id) {
    const sql = `
      SELECT
        id,
        email,
        password,
        is_admin,
        active
      FROM users 
      WHERE id = ? 
      AND deleted = FALSE;
    `;
    return DBAsyncHelpers.get({
      db,
      sql,
      params: [id],
      rejectMessage: 'Erro ao busar usuário por ID com senha',
    });
  }

  async findByEmailWithPassword(email) {
    const sql = `
      SELECT
        id,
        email,
        password,
        is_admin,
        active
      FROM users
      WHERE email = ?
      AND deletado = FALSE;
    `;
    return DBAsyncHelpers.get({
      db,
      sql,
      params: [email],
      rejectMessage: 'Erro ao busar usuário por email com senha',
    });
  }

  async updatePassword(password, id) {
    const sql = `
      UPDATE users 
      SET senha = ? 
      WHERE id = ?;
    `;
    return DBAsyncHelpers.run({
      db,
      sql,
      params: [password, id],
      rejectMessage: 'Erro ao alterar senha do usuário',
    });
  };

  async update(user, id) {
    const userData = buildInsertQuery(user);

    const sql = `
      UPDATE users 
      SET ${userData.fields}
      WHERE id = ?;
    `;

    return DBAsyncHelpers.run({
      db,
      sql,
      params: [...userData.values, id],
      rejectMessage: 'Erro ao atualizar usuário',
    });
  };

  async softDelete(id, deletedBy) {
    const sql = `
      UPDATE users 
      SET 
        deleted = TRUE,
        deleted_by = ?,
        deleted_at = CURRENT_TIMESTAMP
      WHERE id = ?;
    `;
    return DBAsyncHelpers.run({
      db,
      sql,
      params: [deletedBy, id],
      rejectMessage: 'Erro ao deletar usuário',
    });
  };
}

export default new UsersRepository();