const express = require('express');
const router = express.Router();

// --- In-Memory Mock Data Store ---

const conversations = [
  {
    id: 'conv-1',
    participants: ['0x71C7...976F', '0x4F7c...3B1a'],
    jobId: 'JOB-842',
    jobTitle: 'Full-Stack Web3 Application',
    lastMessage: 'The milestone deliverables look great! Approving now.',
    lastMessageAt: new Date('2026-08-15T10:51:00Z'),
    unreadCount: 2,
  },
  {
    id: 'conv-2',
    participants: ['0x71C7...976F', '0x9A22...11fC'],
    jobId: 'JOB-841',
    jobTitle: 'Smart Contract Audit',
    lastMessage: 'Can we schedule a call to discuss the audit scope?',
    lastMessageAt: new Date('2026-08-15T09:25:00Z'),
    unreadCount: 1,
  },
  {
    id: 'conv-3',
    participants: ['0x71C7...976F', '0x22BB...55dB'],
    jobId: 'JOB-839',
    jobTitle: 'Logo & Branding Design',
    lastMessage: 'Love the final logo! Left a 5-star review ⭐',
    lastMessageAt: new Date('2026-08-13T14:00:00Z'),
    unreadCount: 0,
  },
];

const messagesStore = {
  'conv-1': [
    { id: 'm1', sender: '0x4F7c...3B1a', text: "Hey! I've reviewed the smart contract integration for milestone 2.", timestamp: new Date('2026-08-15T10:30:00Z') },
    { id: 'm2', sender: '0x71C7...976F', text: "Great, let me know if the escrow deposit flow looks correct.", timestamp: new Date('2026-08-15T10:35:00Z') },
    { id: 'm3', sender: '0x4F7c...3B1a', text: "Yes, the withdrawal pattern implementation is solid.", timestamp: new Date('2026-08-15T10:42:00Z') },
    { id: 'm4', sender: '0x71C7...976F', text: "Perfect. I've also added event emission for all state transitions.", timestamp: new Date('2026-08-15T10:45:00Z') },
    { id: 'm5', sender: '0x4F7c...3B1a', text: "The milestone deliverables look great! Approving now.", timestamp: new Date('2026-08-15T10:50:00Z') },
    { id: 'm6', sender: '0x4F7c...3B1a', text: "Funds will be released to your wallet shortly 🎉", timestamp: new Date('2026-08-15T10:51:00Z') },
  ],
  'conv-2': [
    { id: 'm1', sender: '0x9A22...11fC', text: "Hi, I saw your profile and your audit work on OpenZeppelin contracts.", timestamp: new Date('2026-08-15T09:00:00Z') },
    { id: 'm2', sender: '0x71C7...976F', text: "Thanks Marcus! Happy to help. What contracts need auditing?", timestamp: new Date('2026-08-15T09:15:00Z') },
    { id: 'm3', sender: '0x9A22...11fC', text: "We have a DeFi lending protocol — about 1,200 lines of Solidity.", timestamp: new Date('2026-08-15T09:20:00Z') },
    { id: 'm4', sender: '0x9A22...11fC', text: "Can we schedule a call to discuss the audit scope?", timestamp: new Date('2026-08-15T09:25:00Z') },
  ],
  'conv-3': [
    { id: 'm1', sender: '0x22BB...55dB', text: "Hi! I need a logo for my new DAO project.", timestamp: new Date('2026-08-11T10:00:00Z') },
    { id: 'm2', sender: '0x71C7...976F', text: "I'd love to work on this. Let me prepare 3 initial concepts.", timestamp: new Date('2026-08-11T11:00:00Z') },
    { id: 'm3', sender: '0x22BB...55dB', text: "Love the final logo! Left a 5-star review ⭐", timestamp: new Date('2026-08-13T14:00:00Z') },
  ],
};

// --- Routes ---

/**
 * GET /api/conversations
 * List all conversations for the current user.
 */
router.get('/conversations', (req, res) => {
  const sorted = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)
  );
  res.json({ conversations: sorted });
});

/**
 * GET /api/messages/:conversationId
 * Fetch all messages for a specific conversation.
 */
router.get('/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const messages = messagesStore[conversationId];

  if (!messages) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }

  res.json({
    conversationId,
    messages,
    total: messages.length,
  });
});

/**
 * POST /api/messages
 * Send a new message to a conversation.
 * Body: { conversationId, sender, text }
 */
router.post('/messages', (req, res) => {
  const { conversationId, sender, text } = req.body;

  if (!conversationId || !sender || !text) {
    return res.status(400).json({ error: 'conversationId, sender, and text are required.' });
  }

  if (!messagesStore[conversationId]) {
    return res.status(404).json({ error: 'Conversation not found.' });
  }

  const newMessage = {
    id: `m${Date.now()}`,
    sender,
    text,
    timestamp: new Date(),
  };

  messagesStore[conversationId].push(newMessage);

  // Update conversation metadata
  const conv = conversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.lastMessage = text;
    conv.lastMessageAt = newMessage.timestamp;
  }

  res.status(201).json({ message: newMessage });
});

module.exports = router;
