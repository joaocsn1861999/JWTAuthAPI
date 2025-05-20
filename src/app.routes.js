import { Router } from 'express';
import userRouter from './routes/user.routes.js';

const appRouter = Router();

appRouter.use('/users', userRouter);

appRouter.use('/helloWorld', (req, res) => {
    return res.status(200).json({
        message: 'Hello World',
    });
});

export default appRouter;