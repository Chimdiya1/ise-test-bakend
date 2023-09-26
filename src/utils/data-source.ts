require('dotenv').config({ path: require('find-config')('.env ') });
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import BaseModel from '../entities/model.entity';

const postgresConfig = config.get<{
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}>('postgresConfig');
const AppDataSource = new DataSource({
    ...postgresConfig,
    type: 'postgres',
    synchronize: true,
    logging: false,
    // ssl: true,
    entities: [User, Course, BaseModel],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
export default AppDataSource;
