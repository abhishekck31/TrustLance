// Component for displaying the wallet avatar.
import Image from 'next/image';

interface WalletAvatarProps {
  address: string;
}

const WalletAvatar: React.FC<WalletAvatarProps> = ({ address }) => {
  // In a real application, this would fetch an actual profile picture based on the address (e.g., using an IPFS service or a dedicated service).
  // Here we use a placeholder generated from the address hash for demonstration.
  const avatarUrl = `https://picsum.photos/seed/${address.slice(-4)}/100/100`;

  return (
    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-500 shadow-lg">
      <Image 
        src={avatarUrl} 
        alt="Wallet Avatar" 
        fill 
        style={{ objectFit: 'cover' }} 
        className="object-cover"
      />
    </div>
  );
};

export default WalletAvatar;