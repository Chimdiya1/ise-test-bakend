import { DeepPartial } from 'typeorm';
import AppDataSource from '../utils/data-source';
import { Course } from '../entities/course.entity';
import { User } from '../entities/user.entity';
import AppError from '../utils/errorHandler';

const courseRepository = AppDataSource.getRepository(Course);

export const createCourse = async (input: DeepPartial<Course>, user: User) => {
    return courseRepository.save(courseRepository.create({ ...input, user }));
};

export const findCourseById = async (courseId: number) => {
    const course = await courseRepository.findOne({
        where: {
            id: courseId,
        },
    });

    if (!course) {
        throw new AppError(404, 'Course with this ID does not exist');
    }

    return course;
};


export const getUserCourses = async (
    page: number = 1,
    pageSize: number = 10,
    user: User
) => {
    const condition = {
        where: {
            user: { id: user.id },
        },
    };
    const courses = await courseRepository.find({
        ...condition,
        skip: (page - 1) * pageSize,
        take: pageSize,
    });
    return {
        count: courses.length,
        total: await courseRepository.count(condition),
        courses,
    };
};