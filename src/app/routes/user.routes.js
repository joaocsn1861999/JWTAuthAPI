import { Router } from 'express';
import UserController from '../controllers/UserController.js';

const userRouter = Router();

userRouter.get(
    '',
    (req, res) => UserController.index(req, res)
);

userRouter.get(
    '/:id',
    (req, res) => UserController.show(req, res)
);

userRouter.post(
    '',
    validarUsuarioCriacao,
    (req, res) => UserController.store(req, res)
);

userRouter.patch(
    '/:id/password',
    (req, res) => UserController.changePassword(req, res)
);

userRouter.patch(
    '/:id',
    (req, res) => UserController.update(req, res)
);

userRouter.delete(
    '/:id',
    (req, res) => UserController.destroy(req, res)
);

export default userRouter;