import db from "../connection.js";
import DBAsyncHelpers from '../helpers/DBAsyncHelpers.js';

export default async function createUsersTable() {
  try {
    await DBAsyncHelpers.run({
      db,
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          is_admin INTEGER NOT NULL DEFAULT 0,
          active INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          deleted INTEGER DEFAULT 0,
          deleted_by INTEGER,
          deleted_at TIMESTAMP,
          FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL
        )
      `,
      params: [],
      rejectMessage: "Erro ao criar tabela users",
    });

    console.log("Tabela users criada com sucesso.");

  } catch (error) {
    console.error("Erro ao criar tabela users:", error.message);
  }
}
