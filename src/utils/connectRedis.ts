import { createClient } from 'redis';

const redisUrl =
    'rediss://red-ck9e86f0vg2c73fu1qt0:ePsp1TEN5Z4iEjqf8c6Pt0JDxNdlCcny@oregon-redis.render.com:6379';

const redisClient = createClient({
    url: redisUrl,
});

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis client connected successfully');
        redisClient.set('try', 'Hello Welcome to Express with TypeORM');
    } catch (error) {
        console.log(error);
        setTimeout(connectRedis, 5000);
    }
};

export default redisClient;
