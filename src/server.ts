require('dotenv').config();
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import AppError from './utils/errorHandler';
import redisClient, { connectRedis } from './utils/connectRedis';
import Controller from './interfaces/controller.interface';

export class Server {
    private readonly _app: express.Application = express();

    constructor(controllers: Controller[]) {
        this._app = express();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        this.unhandledRoutes();
        this.initializeErrorHandlers();
    }
    /**
     * Get Express app
     *
     * @returns {express.Application} Returns Express app
     */
    public getServer(): express.Application {
        return this._app;
    }

    private initializeMiddlewares() {
        // MIDDLEWARE

        // 1. Body parser
        this._app.use(express.json({ limit: '10kb' }));

        // 2. Logger
        if (process.env.NODE_ENV === 'development')
            this._app.use(morgan('dev'));

        // 3. Cookie Parser
        this._app.use(cookieParser());

        // 4. Cors
        this._app.use(
            cors({
                origin: '*',
                credentials: true,
            })
        );

   
    }

    private initializeErrorHandlers() {
        // GLOBAL ERROR HANDLER
        this._app.use(
            (
                error: AppError,
                req: Request,
                res: Response,
                next: NextFunction
            ) => {
                error.error = error.error;
                error.statusCode = error.statusCode || 500;

                res.status(error.statusCode).json({
                    error: true,
                    message: error.message,
                });
            }
        );
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/api', controller.router);
        });
        // HEALTH CHECKER
        this._app.get('/api/healthChecker', async (_, res: Response) => {
            const message = await redisClient.get('try');

            res.status(200).json({
                status: 'success',
                message,
            });
        });
    }

    private unhandledRoutes() {
        // UNHANDLED ROUTE
        this._app.all(
            '*',
            (req: Request, res: Response, next: NextFunction) => {
                next(new AppError(404, `Route ${req.originalUrl} not found`));
            }
        );
    }

    public listen() {
        connectRedis().then(() => {
            this._app.listen(process.env.PORT, () => {
                console.log(`App is Listening on Port ${process.env.PORT}`);
            });
        });
    }

    /**
     * Get Express app
     *
     * @returns {express.Application} Returns Express app
     */
    public get app(): express.Application {
        return this._app;
    }
}
