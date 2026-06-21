import express from 'express'
import { PrismaClient } from '@prisma/client'

const app = express()
const prisma = new PrismaClient()

// Middleware
app.use(express.json())
app.use(express.static('public')) // For serving static assets if needed

// API Routes
app.get('/api/hiring', async (req, res) => {
  try {
    const opportunities = await prisma.hiringOpportunity.findMany({
      orderBy: { postedAt: 'desc' },
    })
    res.status(200).json(opportunities)
  } catch (error) {
    console.error('Error fetching hiring opportunities:', error)
    res.status(500).json({ error: 'Failed to retrieve hiring opportunities' })
  }
})

// Start Server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`)
})