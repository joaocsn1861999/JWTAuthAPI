import sqlite3 from 'sqlite3';

const db = new sqlite3.Database(
  '../../../database/database.sqlite',
  (err) => {
    if (err) console.error('Erro ao conectar ao banco:', err.message);
    else console.log('Conectado ao banco de dados SQLite.');
  }
);

export default db;
