// import { Redis } from 'ioredis';

// if (!global.__redisClientInstance) {
//     const client = new Redis({
//         host: 'redis', // ensure this matches your docker-compose service name
//         port: 6379
//     });

//     client.on('error', (err) => {
//         console.error('Redis error:', err);
//     });

//     global.__redisClientInstance = client;
// }

// export default global.__redisClientInstance;