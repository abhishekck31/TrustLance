const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Connects to the PostgreSQL database and ensures connection status.
 */
async function connectDB() {
    try {
        await prisma.$connect();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1); // Exit process if DB connection fails
    }
}

module.exports = {
    prisma,
    connectDB,
};