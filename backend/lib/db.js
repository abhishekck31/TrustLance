const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * Connects to the PostgreSQL database and exposes the Prisma client.
 * @returns {PrismaClient}
 */
function connectDB() {
    // In a real application, connection pooling and error handling would be more robust.
    return prisma;
}

module.exports = connectDB;