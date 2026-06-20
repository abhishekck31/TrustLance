// Placeholder for Redis connection initialization
const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Connect to Redis
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log('Successfully connected to Redis.');
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
        process.exit(1);
    }
}

connectRedis();

module.exports = redisClient;