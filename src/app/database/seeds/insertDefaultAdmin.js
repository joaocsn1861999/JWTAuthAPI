import db from '../connection.js';
import DBAsyncHelpers from '../DBAsyncHelpers.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

export default async function insertAdminUser() {
  try {
    const user = await DBAsyncHelpers.get({
      db,
      sql: `SELECT * FROM users WHERE email = ?`,
      params: [adminEmail],
      rejectMessage: 'Erro ao buscar admin',
    });

    if (user) {
      console.log('Usuário admin já existe.');
      return;
    }

    const hashPassword = await bcrypt.hash(adminPassword, 10);

    const { insertedID } = await DBAsyncHelpers.run({
      db,
      sql: `INSERT INTO users
        (first_name, last_name, email, senha, administrador)
        VALUES (?, ?, ?, ?, ?)`,
      params: ['Admin', 'Principal', adminEmail, hashPassword, 1],
      rejectMessage: 'Erro ao criar usuário admin',
    });
    
    console.log({
      message: 'Usuário admin criado com sucesso!',
      insertedID: insertedID,
    });
  } catch (error) {
    console.error('Erro ao inserir usuário admin:', error.message);
  }
}
