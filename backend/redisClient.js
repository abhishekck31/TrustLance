// Placeholder for Redis client initialization.
const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function connectRedis() {
    try {
        await redisClient.connect();
        console.log("Successfully connected to Redis.");
    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
}

connectRedis();

module.exports = redisClient;