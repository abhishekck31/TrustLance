const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client (assuming setup is done elsewhere, this provides the connection instance)
const prisma = new PrismaClient();

module.exports = prisma;