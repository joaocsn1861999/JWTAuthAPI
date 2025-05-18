import db from './connection.js';
import createUsersTable from './migrations/createUsersTable.js';
import insertDefaultAdmin from './seeds/insertDefaultAdmin.js';

await createUsersTable();
await insertDefaultAdmin();

db.close();
