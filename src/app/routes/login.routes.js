import { Router } from 'express';
import LoginController from '../controllers/LoginController.js';

const loginRouter = Router();

loginRouter.post(
    '',
    (req, res, next) => LoginController.login(req, res, next)
);

export default loginRouter;