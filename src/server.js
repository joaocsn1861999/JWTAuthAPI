import app from './app.js';
import dotenv from 'dotenv';

dotenv.config({ path:'./.env' });

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
  console.log(`Server running: port ${PORT}`);
});