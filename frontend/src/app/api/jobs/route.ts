import { NextResponse } from 'next/server';

export async function GET() {
  const mockJobs = [
    {
      id: '1',
      title: 'Full Stack Web3 Developer Needed',
      description: 'Looking for an experienced dev to build a decentralized marketplace on Polygon.',
      budget: '3 ETH',
      tags: ['Solidity', 'Next.js', 'Polygon']
    },
    {
      id: '2',
      title: 'Smart Contract Auditor',
      description: 'Need a thorough security audit for our new staking contracts before mainnet launch.',
      budget: '5 ETH',
      tags: ['Security', 'Solidity', 'Audit']
    },
    {
      id: '3',
      title: 'UI/UX Designer for DeFi Dashboard',
      description: 'Seeking a talented designer to revamp our DeFi analytics dashboard. Must have Web3 experience.',
      budget: '1.5 ETH',
      tags: ['Design', 'Figma', 'UI/UX']
    }
  ];

  return NextResponse.json(mockJobs);
}
