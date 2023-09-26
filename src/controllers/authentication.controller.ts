import express, {
    CookieOptions,
    NextFunction,
    Request,
    Response,
} from 'express';
import Controller from '../interfaces/controller.interface';
import { validate } from '../middleware/validate';
import {
    CreateUserInput,
    LoginUserInput,
    createUserSchema,
    loginUserSchema,
} from '../schemas/user.schema';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import {
    createUser,
    findUserByEmail,
    findUserById,
    signTokens,
} from '../services/user.service';
import config from 'config';
import { User } from '../entities/user.entity';
import AppError from '../utils/errorHandler';
import { signJwt, verifyJwt } from '../utils/jwt';
import redisClient from '../utils/connectRedis';

const cookiesOptions: CookieOptions = {
    httpOnly: true,
    sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;
export const accessTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
        Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

export const refreshTokenCookieOptions: CookieOptions = {
    ...cookiesOptions,
    expires: new Date(
        Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
    ),
    maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};

class AuthenticationController implements Controller {
    public path = '/authentication';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(
            `${this.path}/register`,
            validate(createUserSchema),
            this.registerUserHandler
        );
        this.router.post(
            `${this.path}/login`,
            validate(loginUserSchema),
            this.loginUserHandler
        );
        this.router.get(
            `${this.path}/logout`,
            deserializeUser,
            requireUser,
            this.logoutHandler
        );
        this.router.get(`${this.path}/refresh`, this.refreshAccessTokenHandler);
    }

    async registerUserHandler(
        req: Request<{}, {}, CreateUserInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { fullName, password, email } = req.body;

            const user = await createUser({
                fullName,
                email: email.toLowerCase(),
                password,
            });

            res.status(201).json({
                error: false,
                data: {
                    user,
                },
            });
        } catch (err: any) {
            if (err.code === '23505') {
                return res.status(409).json({
                    error: true,
                    message: 'User with that email already exist',
                });
            }
            next(err);
        }
    }

    async loginUserHandler(
        req: Request<{}, {}, LoginUserInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { email, password } = req.body;
            const user = await findUserByEmail({ email });

            // 1. Check if user exists and password is valid
            if (
                !user ||
                !(await User.comparePasswords(password, user.password))
            ) {
                return next(new AppError(400, 'Invalid email or password'));
            }

            // 2. Sign Access and Refresh Tokens
            const { access_token, refresh_token } = await signTokens(user);

            // 3. Add Cookies
            res.cookie('access_token', access_token, accessTokenCookieOptions);
            res.cookie(
                'refresh_token',
                refresh_token,
                refreshTokenCookieOptions
            );
            res.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            // 4. Send response
            res.status(200).json({
                error: false,
                data: {
                    access_token,
                },
            });
        } catch (err: any) {
            next(err);
        }
    }
    async refreshAccessTokenHandler(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const refresh_token = req.cookies.refresh_token;

            const message = 'Could not refresh access token';

            if (!refresh_token) {
                return next(new AppError(403, message));
            }

            // Validate refresh token
            const decoded = verifyJwt<{ sub: string }>(
                refresh_token,
                'refreshTokenPublicKey'
            );

            if (!decoded) {
                return next(new AppError(403, message));
            }

            // Check if user has a valid session
            const session = await redisClient.get(decoded.sub);

            if (!session) {
                return next(new AppError(403, message));
            }

            // Check if user still exist
            const user = await findUserById(JSON.parse(session).id);

            if (!user) {
                return next(new AppError(403, message));
            }

            // Sign new access token
            const access_token = signJwt(
                { sub: user.id },
                'accessTokenPrivateKey',
                {
                    expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
                }
            );

            // 4. Add Cookies
            res.cookie('access_token', access_token, accessTokenCookieOptions);
            res.cookie('logged_in', true, {
                ...accessTokenCookieOptions,
                httpOnly: false,
            });

            // 5. Send response
            res.status(200).json({
                error: false,
                data: {
                    access_token,
                },
            });
        } catch (err: any) {
            next(err);
        }
    }

    private async logout(res: Response) {
        res.cookie('access_token', '', { maxAge: -1 });
        res.cookie('refresh_token', '', { maxAge: -1 });
        res.cookie('logged_in', '', { maxAge: -1 });
    }

    async logoutHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const user = res.locals.user;

            await redisClient.del(user.id);
            this.logout(res);

            res.status(200).json({
                status: 'success',
            });
        } catch (err: any) {
            next(err);
        }
    }
}

export default AuthenticationController;
