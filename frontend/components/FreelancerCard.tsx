import React from 'react';

interface Freelancer {
    id: number;
    name: string;
    primarySkill: string;
    rating: number;
    bio: string;
    totalProjectsCompleted: number;
}

interface FreelancerCardProps {
    freelancer: Freelancer;
}

export const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer }) => {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
            <div className="p-6">
                <h3 className="text-2xl font-bold text-indigo-700 mb-2">{freelancer.name}</h3>
                
                <p className="text-sm text-gray-500 mb-4">
                    <strong>Skill:</strong> {freelancer.primarySkill}
                </p>

                <div className="mb-4">
                    <div className="flex items-center text-xl font-extrabold text-green-600">
                        Rating: {freelancer.rating} / 1000
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Projects Completed: {freelancer.totalProjectsCompleted}</p>
                </div>

                <h4 className="font-semibold mt-3 mb-2 border-t pt-2">Bio Snippet</h4>
                <p className="text-gray-600 text-sm line-clamp-5">{freelancer.bio}</p>
            </div>
        </div>
    );
};