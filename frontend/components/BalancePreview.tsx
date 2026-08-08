// Component for displaying the wallet balance preview.
import { useBalance } from 'wagmi';

interface BalancePreviewProps {
  address: string;
}

const BalancePreview: React.FC<BalancePreviewProps> = ({ address }) => {
  const { data: balance, error } = useBalance({ address: address as `0x${string}` });

  if (error) {
    return <p className="text-red-400">Error fetching balance.</p>;
  }

  const formattedBalance = balance ? balance.formatted : 'N/A';

  return (
    <div className="bg-gray-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-2 text-yellow-400">Balance Preview</h3>
      <p className="text-xl font-bold text-white">
        {formattedBalance} {balance?.symbol || 'ETH'}
      </p>
    </div>
  );
};

export default BalancePreview;