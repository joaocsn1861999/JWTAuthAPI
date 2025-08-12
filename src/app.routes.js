import { Router } from 'express';
import { makeInvoker } from 'awilix-express';
import LoginController from '../controllers/LoginController.js';
import UserController from '../controllers/UserController.js';
import adminUserCheck from '../middlewares/adminUserCheck.js';
import tokenValidator from '../middlewares/tokenValidator.js';

const loginController = makeInvoker(LoginController);
const userController = makeInvoker(UserController);
const appRouter = Router();

appRouter.post('/login', loginController('login'));

appRouter.get('/users', tokenValidator, userController('index'));
appRouter.get('/users/count', tokenValidator, userController('count'));
appRouter.get('/users/:id', tokenValidator, userController('show'));
appRouter.post('/users', userController('store'));
appRouter.patch('/users/me/password', tokenValidator, userController('changePassword'));
appRouter.patch('/users/me', tokenValidator, userController('update'));
appRouter.patch('/users/:id', tokenValidator, adminUserCheck, userController('update'));
appRouter.delete('/users/me', tokenValidator, userController('destroy'));
appRouter.delete('/users/:id', tokenValidator, adminUserCheck, userController('destroy'));

appRouter.use('/helloWorld', (req, res) => {
    return res.status(200).json({
        message: 'Hello World',
    });
});

export default appRouter;