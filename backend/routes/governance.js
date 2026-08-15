const express = require('express');
const router = express.Router();

// --- In-Memory Mock Data Store ---

const proposals = [
  {
    id: 'TLP-012',
    title: 'Reduce Platform Fee from 2.5% to 1.5%',
    description: 'Lower the platform commission fee to attract more freelancers and clients. The reduction would be offset by the expected increase in transaction volume.',
    proposer: '0x4F7c...3B1a',
    status: 'Active',
    votesFor: 847200,
    votesAgainst: 312400,
    votesAbstain: 45800,
    quorum: 1000000,
    deadline: '2026-08-20T00:00:00Z',
    category: 'Treasury',
    stakeRequired: 100,
    voters: {},
    createdAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'TLP-011',
    title: 'Add Support for Arbitrum L2 Deployment',
    description: 'Deploy core contracts on Arbitrum One for lower gas fees. Estimated cost: 15,000 USDC from treasury.',
    proposer: '0x9A22...11fC',
    status: 'Active',
    votesFor: 1245000,
    votesAgainst: 89000,
    votesAbstain: 120000,
    quorum: 1000000,
    deadline: '2026-08-18T00:00:00Z',
    category: 'Infrastructure',
    stakeRequired: 100,
    voters: {},
    createdAt: '2026-08-08T10:00:00Z',
  },
  {
    id: 'TLP-010',
    title: 'Implement Quadratic Voting for Dispute Resolution',
    description: 'Replace stake-weighted voting with quadratic voting for fairer dispute resolution outcomes.',
    proposer: '0xBB44...77eA',
    status: 'Passed',
    votesFor: 1560000,
    votesAgainst: 340000,
    votesAbstain: 100000,
    quorum: 1000000,
    deadline: '2026-08-12T00:00:00Z',
    category: 'Governance',
    stakeRequired: 100,
    voters: {},
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'TLP-009',
    title: 'Increase Minimum Juror Stake to 500 TLT',
    description: 'Raise the minimum staking threshold from 100 TLT to 500 TLT for juror eligibility.',
    proposer: '0x22BB...55dB',
    status: 'Rejected',
    votesFor: 230000,
    votesAgainst: 890000,
    votesAbstain: 180000,
    quorum: 1000000,
    deadline: '2026-08-08T00:00:00Z',
    category: 'Governance',
    stakeRequired: 100,
    voters: {},
    createdAt: '2026-07-28T09:00:00Z',
  },
  {
    id: 'TLP-008',
    title: 'Launch TrustLance Grants Program (50,000 USDC)',
    description: 'Allocate 50,000 USDC from treasury for ecosystem grants to fund tools and educational content.',
    proposer: '0x4F7c...3B1a',
    status: 'Pending',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    quorum: 1000000,
    deadline: '2026-08-25T00:00:00Z',
    category: 'Treasury',
    stakeRequired: 250,
    voters: {},
    createdAt: '2026-08-15T14:00:00Z',
  },
];

// --- Routes ---

/**
 * GET /api/governance/proposals
 * List all proposals with optional status filter.
 * Query params: ?status=Active
 */
router.get('/proposals', (req, res) => {
  const { status } = req.query;
  let result = proposals;

  if (status && ['Active', 'Passed', 'Rejected', 'Pending'].includes(status)) {
    result = proposals.filter((p) => p.status === status);
  }

  // Strip voter details from list response
  const sanitized = result.map(({ voters, ...rest }) => ({
    ...rest,
    totalVotes: rest.votesFor + rest.votesAgainst + rest.votesAbstain,
  }));

  res.json({
    proposals: sanitized,
    total: sanitized.length,
    stats: {
      active: proposals.filter((p) => p.status === 'Active').length,
      passed: proposals.filter((p) => p.status === 'Passed').length,
      rejected: proposals.filter((p) => p.status === 'Rejected').length,
      pending: proposals.filter((p) => p.status === 'Pending').length,
    },
  });
});

/**
 * GET /api/governance/proposals/:id
 * Get detailed proposal information.
 */
router.get('/proposals/:id', (req, res) => {
  const proposal = proposals.find((p) => p.id === req.params.id);

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  const { voters, ...rest } = proposal;
  res.json({
    proposal: {
      ...rest,
      totalVotes: rest.votesFor + rest.votesAgainst + rest.votesAbstain,
      voterCount: Object.keys(voters).length,
    },
  });
});

/**
 * POST /api/governance/proposals/:id/vote
 * Cast a vote on a proposal.
 * Body: { voter, vote: 'for' | 'against' | 'abstain', stake }
 */
router.post('/proposals/:id/vote', (req, res) => {
  const proposal = proposals.find((p) => p.id === req.params.id);

  if (!proposal) {
    return res.status(404).json({ error: 'Proposal not found.' });
  }

  if (proposal.status !== 'Active') {
    return res.status(400).json({ error: `Cannot vote. Proposal status: ${proposal.status}` });
  }

  const { voter, vote, stake } = req.body;

  if (!voter || !vote || !stake) {
    return res.status(400).json({ error: 'voter, vote, and stake are required.' });
  }

  if (!['for', 'against', 'abstain'].includes(vote)) {
    return res.status(400).json({ error: "vote must be 'for', 'against', or 'abstain'." });
  }

  if (stake < proposal.stakeRequired) {
    return res.status(400).json({ error: `Minimum stake of ${proposal.stakeRequired} TLT required.` });
  }

  // Check for duplicate vote
  if (proposal.voters[voter]) {
    return res.status(409).json({ error: 'You have already voted on this proposal.' });
  }

  // Record vote
  proposal.voters[voter] = { vote, stake, timestamp: new Date() };

  // Update tallies with stake-weighted vote
  if (vote === 'for') proposal.votesFor += stake;
  else if (vote === 'against') proposal.votesAgainst += stake;
  else proposal.votesAbstain += stake;

  res.json({
    message: `Vote "${vote}" recorded successfully with ${stake} TLT weight.`,
    proposal: {
      id: proposal.id,
      votesFor: proposal.votesFor,
      votesAgainst: proposal.votesAgainst,
      votesAbstain: proposal.votesAbstain,
      totalVotes: proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain,
    },
  });
});

module.exports = router;
