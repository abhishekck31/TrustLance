// Component for resolving ENS names. Requires an external service or direct RPC call (mocked here).
import React, { useState, useEffect } from 'react';

interface ENSResolverProps {
  address: string;
}

const ENSResolver: React.FC<ENSResolverProps> = ({ address }) => {
  const [ensName, setEnsName] = useState<string>('Resolving...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock ENS resolution logic. In production, this calls an RPC node or an ENS resolver API.
    const resolveENS = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate network latency for demonstration
        await new Promise(resolve => setTimeout(resolve, 500)); 
        
        // Mock resolution based on the address
        if (address.toLowerCase().includes('alice')) {
          setEnsName('alice.eth');
        } else if (address.toLowerCase().includes('bob')) {
          setEnsName('bob.eth');
        } else {
          setEnsName('unknown.eth');
        }
      } catch (e) {
        setError("Failed to resolve ENS name.");
        setEnsName("Error");
      } finally {
        setLoading(false);
      }
    };

    resolveENS();
  }, [address]);

  if (loading) {
    return <p className="text-gray-400">Resolving ENS...</p>;
  }

  if (error) {
    return <p className="text-red-400">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2 text-blue-400">ENS Support</h3>
      <p className="text-xl font-bold text-white">{ensName}</p>
    </div>
  );
};

export default ENSResolver;