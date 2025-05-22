import { Router } from 'express';
import UserController from '../controllers/UserController.js';

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
    (req, res, next) => UserController.store(req, res, next)
);

userRouter.patch(
    '/me/password',
    (req, res, next) => UserController.changePassword(req, res, next)
);

userRouter.patch(
    '/:id',
    (req, res, next) => UserController.update(req, res, next)
);

userRouter.delete(
    '/:id',
    (req, res, next) => UserController.destroy(req, res, next)
);

export default userRouter;