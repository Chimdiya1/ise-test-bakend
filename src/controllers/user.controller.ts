import express, { NextFunction, Request, Response } from 'express';
import Controller from '../interfaces/controller.interface';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';

class UserController implements Controller {
    public path = '/user';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(deserializeUser, requireUser);

        // Get currently logged in user
        this.router.get(`${this.path}/me`, this.getMeHandler);
    }

    async getMeHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;

            res.status(200).status(200).json({
                status: 'success',
                data: {
                    user,
                },
            });
        } catch (err: any) {
            next(err);
        }
    }
}

export default UserController;
