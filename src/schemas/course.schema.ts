import { z, object, TypeOf } from 'zod';

// Define a schema for course validation
export const courseSchema = object({
    // courses: object({
    body: object({
        courseName: z.string({
            required_error: 'name is required',
        }),
    }),
    // })
});

const params = {
    params: object({
        courseId: z.string(),
    }),
};

export const getCourseSchema = object({
    ...params,
});

const paginationQuery = {
    query: object({
        page: z.number(),
        pageSize: z.number(),
    }),
};
export const getCoursesSchema = object({
    ...paginationQuery,
});

export type GetCourseInput = TypeOf<typeof getCourseSchema>['params'];
export type GetCoursesInput = TypeOf<typeof getCoursesSchema>['query'];

export type CreateCourseInput = TypeOf<typeof courseSchema>['body'];
