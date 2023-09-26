require('dotenv').config({ path: require('find-config')('.env ') });
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import config from 'config';


const postgresConfig =
        config.get<{
              host: string;
              port: number;
              username: string;
              password: string;
              database: string;
          }>('postgresConfig')
const AppDataSource = new DataSource({
    ...postgresConfig,
    type: 'postgres',
    synchronize: true,
    logging: false,
    // ssl: true,
    entities: ['src/entities/*.entity{.ts,.js}'],
    migrations: ['src/migrations/**/*{.ts,.js}'],
    subscribers: ['src/subscribers/**/*{.ts,.js}'],
});
export default AppDataSource;
