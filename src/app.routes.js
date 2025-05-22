import { Router } from 'express';
import userRouter from './app/routes/user.routes.js';
import loginRouter from './app/routes/login.routes.js';
import tokenValidator from './app/middlewares/tokenValidator.js';

const appRouter = Router();

appRouter.use('/users', tokenValidator, userRouter);
appRouter.use('/login', loginRouter);

appRouter.use('/helloWorld', (req, res) => {
    return res.status(200).json({
        message: 'Hello World',
    });
});

export default appRouter;