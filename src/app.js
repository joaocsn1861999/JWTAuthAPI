import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import appRouter from './app.routes.js';
import errorHandler from './app/middlewares/errorHandler.js'

dotenv.config({ path:'./.env' });

const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
}));
app.use('/api/v1', appRouter);
app.use(errorHandler);

export default app;