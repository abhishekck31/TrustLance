import redis from 'redis';

let redisClient: redis.Redis;

export async function setupRedis() {
    try {
        // Assuming Redis is running on default port
        redisClient = redis.createClient({
            url: process.env.REDIS_URL || 'redis://localhost:6379'
        });

        await redisClient.connect();
        console.log("Successfully connected to Redis.");

    } catch (err) {
        console.error("Failed to connect to Redis:", err);
    }
}

// Example function demonstrating interaction
export async function cacheListing(listingId: number, data: any) {
    if (redisClient) {
        await redisClient.set(`listing:${listingId}`, JSON.stringify(data), { EX: 3600 });
        console.log(`Cached listing ${listingId} in Redis.`);
    }
}