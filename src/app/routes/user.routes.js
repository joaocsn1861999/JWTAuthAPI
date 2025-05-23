import { Router } from 'express';
import UserController from '../controllers/UserController.js';
import adminUserCheck from '../middlewares/adminUserCheck.js';

const userRouter = Router();

userRouter.get(
    '',
    (req, res, next) => UserController.index(req, res, next)
);

userRouter.get(
    '/:id',
    (req, res, next) => UserController.show(req, res, next)
);

userRouter.post(
    '',
    adminUserCheck,
    (req, res, next) => UserController.store(req, res, next)
);

userRouter.patch(
    '/me/password',
    adminUserCheck,
    (req, res, next) => UserController.changePassword(req, res, next)
);

userRouter.patch(
    '/:id',
    adminUserCheck,
    (req, res, next) => UserController.update(req, res, next)
);

userRouter.delete(
    '/:id',
    adminUserCheck,
    (req, res, next) => UserController.destroy(req, res, next)
);

export default userRouter;