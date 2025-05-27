import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import adminUserCheck from '../middlewares/adminUserCheck.js';
import tokenValidator from '../middlewares/tokenValidator.js';

const userRouter = Router();

userRouter.get(
    '',
    tokenValidator,
    (req, res, next) => UserController.index(req, res, next)
);

userRouter.get(
    '/count',
    tokenValidator,
    (req, res, next) => UserController.count(req, res, next)
);

userRouter.get(
    '/:id',
    tokenValidator,
    (req, res, next) => UserController.show(req, res, next)
);

userRouter.post(
    '',
    (req, res, next) => UserController.store(req, res, next)
);

userRouter.patch(
    '/me/password',
    tokenValidator,
    (req, res, next) => UserController.changePassword(req, res, next)
);

userRouter.patch(
    '/me',
    tokenValidator,
    (req, res, next) => UserController.update(req, res, next, me = true)
);

userRouter.patch(
    '/:id',
    tokenValidator,
    adminUserCheck,
    (req, res, next) => UserController.update(req, res, next, me = false)
);

userRouter.delete(
    '/me',
    tokenValidator,
    (req, res, next) => UserController.destroy(req, res, next, me = true)
);

userRouter.delete(
    '/:id',
    tokenValidator,
    adminUserCheck,
    (req, res, next) => UserController.destroy(req, res, next, me = false)
);

export default userRouter;