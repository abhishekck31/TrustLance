// Component for displaying the wallet balance preview.
import { useEtherBalance } from 'wagmi';

interface BalancePreviewProps {
  address: string;
}

const BalancePreview: React.FC<BalancePreviewProps> = ({ address }) => {
  const { data: etherBalance, error } = useEtherBalance({ address });

  if (error) {
    return <p className="text-red-400">Error fetching balance.</p>;
  }

  // Convert wei to a more readable format (e.g., Ether)
  const formattedBalance = etherBalance ? (etherBalance / 10**18).toFixed(4) : 'N/A';

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2 text-yellow-400">Balance Preview</h3>
      <p className="text-xl font-bold text-white">
        {formattedBalance} ETH
      </p>
    </div>
  );
};

export default BalancePreview;