const express = require('express');
const router = express.Router();

// --- In-Memory Mock Data Store ---

const escrows = [
  {
    id: 'ESC-001',
    title: 'Full-Stack Web3 Application',
    client: '0x4F7c...3B1a',
    freelancer: '0x71C7...976F',
    totalAmount: 15000,
    currency: 'USDC',
    state: 'Locked',
    createdAt: '2026-08-10T12:00:00Z',
    txHash: '0xabc123def456789abc123def456789abc123def456789abc123def456789abcd',
    milestones: [
      { id: 1, title: 'Project Setup & Architecture', amount: 2000, status: 'released' },
      { id: 2, title: 'Smart Contract Development', amount: 5000, status: 'approved' },
      { id: 3, title: 'Frontend Integration', amount: 5000, status: 'active' },
      { id: 4, title: 'Testing & Deployment', amount: 3000, status: 'pending' },
    ],
  },
  {
    id: 'ESC-002',
    title: 'Smart Contract Security Audit',
    client: '0x9A22...11fC',
    freelancer: '0x71C7...976F',
    totalAmount: 5000,
    currency: 'USDC',
    state: 'Created',
    createdAt: '2026-08-14T09:00:00Z',
    txHash: '0x789abcdef123456789abcdef123456789abcdef123456789abcdef123456789a',
    milestones: [
      { id: 1, title: 'Full Audit Report', amount: 5000, status: 'pending' },
    ],
  },
  {
    id: 'ESC-003',
    title: 'Logo & Brand Identity',
    client: '0x22BB...55dB',
    freelancer: '0x71C7...976F',
    totalAmount: 800,
    currency: 'USDC',
    state: 'Released',
    createdAt: '2026-07-28T15:30:00Z',
    txHash: '0xfed987654abc321fed987654abc321fed987654abc321fed987654abc321fedc',
    milestones: [
      { id: 1, title: 'Logo Design & Brand Kit', amount: 800, status: 'released' },
    ],
  },
  {
    id: 'ESC-004',
    title: 'DeFi Yield Aggregator',
    client: '0xBB44...77eA',
    freelancer: '0x71C7...976F',
    totalAmount: 25000,
    currency: 'USDC',
    state: 'Disputed',
    createdAt: '2026-07-15T08:00:00Z',
    txHash: '0x456xyzuvw789456xyzuvw789456xyzuvw789456xyzuvw789456xyzuvw789456',
    milestones: [
      { id: 1, title: 'Protocol Architecture', amount: 5000, status: 'released' },
      { id: 2, title: 'Vault Strategy Contracts', amount: 8000, status: 'approved' },
      { id: 3, title: 'Frontend Dashboard', amount: 7000, status: 'active' },
      { id: 4, title: 'Mainnet Launch', amount: 5000, status: 'pending' },
    ],
  },
];

let nextEscrowId = 5;

// --- Routes ---

/**
 * GET /api/escrows
 * List all escrows with optional state filter.
 * Query params: ?state=Locked
 */
router.get('/', (req, res) => {
  const { state } = req.query;
  let result = escrows;

  if (state && ['Created', 'Locked', 'Released', 'Disputed'].includes(state)) {
    result = escrows.filter((e) => e.state === state);
  }

  res.json({
    escrows: result,
    total: result.length,
    stats: {
      total: escrows.length,
      created: escrows.filter((e) => e.state === 'Created').length,
      locked: escrows.filter((e) => e.state === 'Locked').length,
      released: escrows.filter((e) => e.state === 'Released').length,
      disputed: escrows.filter((e) => e.state === 'Disputed').length,
    },
  });
});

/**
 * GET /api/escrows/:id
 * Get escrow details by ID.
 */
router.get('/:id', (req, res) => {
  const escrow = escrows.find((e) => e.id === req.params.id);

  if (!escrow) {
    return res.status(404).json({ error: 'Escrow not found.' });
  }

  res.json({ escrow });
});

/**
 * POST /api/escrows
 * Create a new escrow.
 * Body: { title, client, freelancer, totalAmount, milestones: [{ title, amount }] }
 */
router.post('/', (req, res) => {
  const { title, client, freelancer, totalAmount, milestones } = req.body;

  if (!title || !client || !freelancer || !totalAmount) {
    return res.status(400).json({ error: 'title, client, freelancer, and totalAmount are required.' });
  }

  const newEscrow = {
    id: `ESC-${String(nextEscrowId++).padStart(3, '0')}`,
    title,
    client,
    freelancer,
    totalAmount,
    currency: 'USDC',
    state: 'Created',
    createdAt: new Date().toISOString(),
    txHash: `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`,
    milestones: milestones
      ? milestones.map((m, i) => ({ id: i + 1, ...m, status: 'pending' }))
      : [{ id: 1, title: 'Full Delivery', amount: totalAmount, status: 'pending' }],
  };

  escrows.push(newEscrow);

  res.status(201).json({ escrow: newEscrow });
});

/**
 * PATCH /api/escrows/:id/release
 * Release the next eligible milestone for an escrow.
 */
router.patch('/:id/release', (req, res) => {
  const escrow = escrows.find((e) => e.id === req.params.id);

  if (!escrow) {
    return res.status(404).json({ error: 'Escrow not found.' });
  }

  if (escrow.state !== 'Locked' && escrow.state !== 'Created') {
    return res.status(400).json({ error: `Cannot release funds. Current state: ${escrow.state}` });
  }

  // Find the next approved or active milestone and release it
  const milestone = escrow.milestones.find(
    (m) => m.status === 'approved' || m.status === 'active'
  );

  if (!milestone) {
    return res.status(400).json({ error: 'No eligible milestone found for release.' });
  }

  milestone.status = 'released';

  // Check if all milestones are released
  const allReleased = escrow.milestones.every((m) => m.status === 'released');
  if (allReleased) {
    escrow.state = 'Released';
  }

  res.json({
    escrow,
    releasedMilestone: milestone,
    message: `Milestone "${milestone.title}" released successfully.`,
  });
});

module.exports = router;
