import express, { Request, Response, NextFunction } from 'express';
import Controller from '../interfaces/controller.interface';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import {
    CreateCourseInput,
    GetCourseInput,
    GetCoursesInput,
    courseSchema,
    getCourseSchema,
} from '../schemas/course.schema';
import AppError from '../utils/errorHandler';
import { createCourse, findCourseById, getUserCourses } from '../services/course.service';
import { findUserById } from '../services/user.service';

class CourseController implements Controller {
    public path = '/courses';
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.use(deserializeUser, requireUser);
        this.router.post(
            `${this.path}/create`,
            validate(courseSchema),
            this.createCourseHandler
        );
        this.router.get(
            `${this.path}`,
            this.getCoursesHandler
        );
        // this.router.get(`${this.path}/:courseId/download`, this.downloadCourse);
        this.router.get(
            `${this.path}/:courseId`,
            validate(getCourseSchema),
            this.getCourseHandler
        );
    }

    async createCourseHandler(
        req: Request<{}, {}, CreateCourseInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { courseName } = req.body;
            const user = await findUserById(res.locals.user.id);
            const course = await createCourse(
                {
                    courseName: courseName,
                },
                user!
            );

            res.status(201).json({
                error: false,
                data: {
                    course,
                },
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getCourseHandler(
        req: Request<GetCourseInput>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const course = await findCourseById(Number(req.params.courseId));
            if (!course) {
                return next(
                    new AppError(404, 'Course with this ID does not exist')
                );
            }

            res.status(200).json({
                error: false,
                data: {
                    course,
                },
            });
        } catch (error) {
            next(error);
        }
    }
    async getCoursesHandler(
        req: Request<{}, GetCoursesInput, {}>,
        res: Response,
        next: NextFunction
    ) {
        try {
            const user = await findUserById(res.locals.user.id);
            const courses = await getUserCourses(
                Number(req.query.page) ? Number(req.query.page) : 1,
                Number(req.query.pageSize) ? Number(req.query.pageSize) : 10,
                user!
            );

            res.status(200).json({
                error: false,
                data: courses,
            });
        } catch (err) {
            next(err);
        }
    }
}

export default CourseController;
