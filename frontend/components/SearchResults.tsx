import { FreelancerCard } from './FreelancerCard';

interface SearchResultsProps {
  freelancers: any[]; // Ideally, define a specific Freelancer type interface
}

export const SearchResults: React.FC<SearchResultsProps> = ({ freelancers }) => {
  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">Discovery Results ({freelancers.length})</h2>
      {freelancers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {freelancers.map((freelancer) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} />
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-500 mt-4">No matching freelancers found.</p>
      )}
    </div>
  );
};