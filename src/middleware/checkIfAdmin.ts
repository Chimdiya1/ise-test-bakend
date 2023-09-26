import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/errorHandler';
import { RoleEnumType } from '../entities/user.entity';

export const checkIfAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = res.locals.user;

        if (user.role !== RoleEnumType.ADMIN) {
            return next(new AppError(401, 'Unauthorized!'));
        }

        next();
    } catch (err: any) {
        next(err);
    }
};
