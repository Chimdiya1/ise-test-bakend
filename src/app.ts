require('dotenv').config();

import AppDataSource from './utils/data-source';
import validateEnv from './utils/validateEnv';
import { Server } from './server';
import AuthenticationController from './controllers/authentication.controller';
import CourseController from './controllers/course.controller';
import UserController from './controllers/user.controller';

// const app = new Server().app

validateEnv();

(async () => {
    AppDataSource.initialize().then(() => {
        const app = new Server([
            new AuthenticationController(),
            new CourseController(),
            new UserController(),
        ]);

        app.listen();
    });
})();
