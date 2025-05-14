import { Router } from 'express';

const appRouter = Router();

appRouter.use('/helloWorld', (req, res) => {
    return res.status(200).json({
        message: 'Hello World',
    });
});

export default appRouter;