// Main server setup for the Node.js/Express backend.
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Endpoints for Fee Engine ---

/**
 * GET /api/fees - Retrieve all dynamic fee configurations.
 */
app.get('/api/fees', async (req, res) => {
  try {
    const fees = await prisma.platformFeeConfig.findMany({
      include: {
        createdAt: true,
        updatedAt: true,
      }
    });
    res.json(fees);
  } catch (error) {
    console.error("Error fetching fee configurations:", error);
    res.status(500).json({ error: "Failed to retrieve fee configurations" });
  }
});

/**
 * POST /api/fees - Create a new dynamic platform fee configuration.
 */
app.post('/api/fees', async (req, res) => {
  const { name, feePercentage, isActive } = req.body;

  if (!name || typeof feePercentage === 'undefined') {
    return res.status(400).json({ error: "Missing required fields: name and feePercentage" });
  }

  try {
    const newConfig = await prisma.platformFeeConfig.create({
      data: {
        name: name,
        feePercentage: Number(feePercentage), // Stored as BigInt in DB model via Prisma type mapping if necessary, or handled by application logic
        isActive: isActive === 'true',
      },
    });
    res.status(201).json(newConfig);
  } catch (error) {
    console.error("Error creating fee configuration:", error);
    res.status(500).json({ error: "Failed to create fee configuration" });
  }
});

/**
 * PUT /api/fees/:id - Update an existing dynamic platform fee configuration.
 */
app.put('/api/fees/:id', async (req, res) => {
  const { id } = req.params;
  const { name, feePercentage, isActive } = req.body;

  try {
    const updatedConfig = await prisma.platformFeeConfig.update({
      where: { id: parseInt(id) },
      data: {
        name: name,
        feePercentage: Number(feePercentage),
        isActive: isActive === 'true',
        updatedAt: new Date(),
      },
    });
    res.json(updatedConfig);
  } catch (error) {
    console.error("Error updating fee configuration:", error);
    res.status(500).json({ error: "Failed to update fee configuration" });
  }
});


// --- Example Endpoint for Fee Calculation Simulation ---

/**
 * POST /api/calculate-fee - Simulate calculation based on a dynamic configuration.
 */
app.post('/api/calculate-fee', async (req, res) => {
    const { configId, amount } = req.body;

    try {
        const config = await prisma.platformFeeConfig.findUnique({ where: { id: configId} });

        if (!config) {
            return res.status(404).json({ error: "Fee configuration not found" });
        }

        // Calculation: feePercentage (basis points / 10000) * amount / 10000
        const platformFee = (Number(config.feePercentage) * amount) / 10000;

        res.json({
            amount,
            platformFee: Math.floor(platformFee), // Use floor for whole units or adjust precision
            details: `Calculated using config ID ${configId}: ${config.name} (${(config.feePercentage / 10000 * 100).toFixed(2)}%)`
        });

    } catch (error) {
        console.error("Error during fee calculation:", error);
        res.status(500).json({ error: "Failed to calculate fee" });
    }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});