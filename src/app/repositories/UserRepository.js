export default class UserRepository {

  constructor ({db, dbAsyncHelpers, buildInsertQuery, buildUpdateQuery}) {
    this.db = db;
    this.dbAsyncHelpers = dbAsyncHelpers;
    this.buildInsertQuery = buildInsertQuery;
    this.buildUpdateQuery = buildUpdateQuery;
  };

  async create(user) {
    const userData = this.buildInsertQuery(user);
    const sql = `
      INSERT
      INTO users (${userData.fields})
      VALUES (${userData.placeholders})
    `;

    return this.dbAsyncHelpers.run({
      db : this.db,
      sql,
      params: userData.values,
      rejectMessage: 'Erro ao criar usuário',
    });
  };

  async findAllWithPagination(limit, offset, filters = {}) {
    let conditions = ['deleted = FALSE'];
    let params = [];
    if (filters.name) {
      conditions = ['first_name LIKE ?'];
      params.push(`%${filters.name}%`);
    }
    if (filters.active !== null) {
      conditions.push('active = ?');
      params.push(filters.active);
    }
    if (filters.is_admin !== null) {
      conditions.push('is_admin = ?');
      params.push(filters.is_admin);
    }

    params.push(limit, offset);
    
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
      WHERE ${conditions.join(' AND ')}
      LIMIT ? 
      OFFSET ?;
    `;
    return this.dbAsyncHelpers.all({
      db : this.db,
      sql,
      params: params,
      rejectMessage: 'Erro ao buscar usuários com paginação',
    });
  };

  async count(filters = {}) {
    let conditions = ['deleted = FALSE'];
    let params = [];
    if (filters.name) {
      conditions = ['first_name LIKE ?'];
      params.push(`%${filters.name}%`);
    }
    if (filters.active !== null) {
      conditions.push('active = ?');
      params.push(filters.active);
    }
    if (filters.is_admin !== null) {
      conditions.push('is_admin = ?');
      params.push(filters.is_admin);
    }

    const sql = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE ${conditions.join(' AND ')};
    `;
    return this.dbAsyncHelpers.get({
      db : this.db,
      sql,
      params: params,
      rejectMessage: 'Erro ao contar usuários',
    });
  };

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
    return this.dbAsyncHelpers.get({
      db : this.db,
      sql,
      params: [id],
      rejectMessage: 'Erro ao buscar usuário por ID',
    });
  };

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
    return this.dbAsyncHelpers.get({
      db : this.db,
      sql,
      params: [id],
      rejectMessage: 'Erro ao buscar usuário por ID com senha',
    });
  };

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
      AND deleted = FALSE
      and active = TRUE;
    `;
    return this.dbAsyncHelpers.get({
      db : this.db,
      sql,
      params: [email],
      rejectMessage: 'Erro ao buscar usuário por email com senha',
    });
  };

  async checkIfEmailExists(email) {
    const sql = `
      SELECT
        id,
        email,
        deleted
      FROM users
      WHERE email = ?;
    `;
    return this.dbAsyncHelpers.get({
      db : this.db,
      sql,
      params: [email],
      rejectMessage: 'Erro ao buscar usuário',
    });
  };

  async updatePassword(hashPassword, id) {
    const sql = `
      UPDATE users 
      SET password = ? 
      WHERE id = ?;
    `;
    return this.dbAsyncHelpers.run({
      db : this.db,
      sql,
      params: [hashPassword, id],
      rejectMessage: 'Erro ao alterar senha do usuário',
    });
  };

  async update(user, id) {
    const userData = this.buildUpdateQuery(user);

    const sql = `
      UPDATE users 
      SET ${userData.fields}
      WHERE id = ?;
    `;

    return this.dbAsyncHelpers.run({
      db : this.db,
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
    return this.dbAsyncHelpers.run({
      db : this.db,
      sql,
      params: [deletedBy, id],
      rejectMessage: 'Erro ao deletar usuário',
    });
  };
};