import { Router } from 'express';
import { makeInvoker } from 'awilix-express';
import LoginController from './app/controllers/LoginController.js';
import UserController from './app/controllers/UserController.js';
import adminUserCheck from './app/middlewares/adminUserCheck.js';
import tokenValidator from './app/middlewares/tokenValidator.js';
import { meScope, otherUserScope } from './app/middlewares/requestScope.js'

const loginController = makeInvoker(LoginController);
const userController = makeInvoker(UserController);
const appRouter = Router();

appRouter.post('/login', loginController('login'));

appRouter.get('/users', tokenValidator, userController('index'));
appRouter.get('/users/count', tokenValidator, userController('count'));
appRouter.get('/users/:id', tokenValidator, userController('show'));
appRouter.post('/users', userController('store'));
appRouter.patch('/users/me/password', tokenValidator, userController('changePassword'));
appRouter.patch('/users/me', tokenValidator, meScope, userController('update'));
appRouter.patch('/users/:id', tokenValidator, otherUserScope, adminUserCheck, userController('update'));
appRouter.delete('/users/me', tokenValidator, meScope, userController('destroy'));
appRouter.delete('/users/:id', tokenValidator, otherUserScope, adminUserCheck, userController('destroy'));

appRouter.use('/helloWorld', (req, res) => {
    return res.status(200).json({
        message: 'Hello World',
    });
});

export default appRouter;