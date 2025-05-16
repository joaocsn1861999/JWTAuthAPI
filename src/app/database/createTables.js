import db from './connection.js';

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL,
      administrador INTEGER NOT NULL DEFAULT 0,
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deletado INTEGER DEFAULT 0,
      deletado_por INTEGER,
      deletado_em TIMESTAMP,
      FOREIGN KEY (deletado_por) REFERENCES users(id) ON DELETE SET NULL
    )
  `, (err) => {
    if (err) {
      console.error('Erro ao criar tabela users:', err.message);
    } else {
      console.log('Tabela users criada com sucesso.');
    }
  });
});

db.close();
