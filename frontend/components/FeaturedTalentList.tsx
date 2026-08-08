// Frontend component to display the list of featured talents.
import React from 'react';
import Link from 'next/link';

export interface TalentModel {
    id: string;
    name: string;
    description: string;
    isFeatured: boolean;
}

interface FeaturedTalentCardProps {
    talent: TalentModel;
}

const FeaturedTalentCard: React.FC<FeaturedTalentCardProps> = ({ talent }) => {
    return (
        <div className="border p-6 rounded-lg shadow-xl transition duration-300 hover:shadow-2xl bg-white">
            <div className="flex justify-between items-start mb-4 border-b pb-2">
                <h2 className="text-3xl font-bold text-indigo-700">{talent.name}</h2>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${talent.isFeatured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                    {talent.isFeatured ? '🔥 Featured' : 'Standard'}
                </span>
            </div>
            <p className="text-gray-700 mb-4 border-l-4 border-indigo-500 pl-3">{talent.description}</p>
            <Link href={`/talents/${talent.id}`} className="inline-block mt-4 text-indigo-600 font-medium hover:text-indigo-800 transition">
                View Full Profile &rarr;
            </Link>
        </div>
    );
};

interface FeaturedTalentListProps {
    talents: TalentModel[];
}

const FeaturedTalentList: React.FC<FeaturedTalentListProps> = ({ talents }) => {
    if (!talents || talents.length === 0) {
        return <p className="text-center text-gray-500">No featured talents found at this time.</p>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {talents.map((talent) => (
                <FeaturedTalentCard key={talent.id} talent={talent} />
            ))}
        </div>
    );
};

export default FeaturedTalentList;