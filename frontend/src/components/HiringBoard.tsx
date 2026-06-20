import React from 'react';
import { HiringOpportunity } from '@/types/hiring'; // Import the defined type structure
import { format } from 'date-fns';

interface HiringBoardProps {
    opportunities: HiringOpportunity[];
}

const HiringBoard: React.FC<HiringBoardProps> = ({ opportunities }) => {
    if (!opportunities || opportunities.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500 hover:shadow-2xl transition duration-300 ease-in-out">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-3">{opp.title}</h2>

                    {/* Metadata Section */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 border-b pb-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a1.998 1.998 0 010-2.828l4.243-4.243a1.998 1.998 0 012.828 0l4.243 4.243a1.998 1.998 0 010 2.828l-4.243 4.243z" /></svg>
                            <span>📍 Location: {opp.location}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>💰 Salary: ${opp.salary.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>📅 Posted: {format(new Date(opp.postedAt), 'MMMM d, yyyy')}</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Opportunity Details</h3>
                        <p className="text-gray-600 leading-relaxed">{opp.description}</p>
                    </div>

                    {/* Action Button */}
                    <button className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md">
                        Explore This Opportunity
                    </button>
                </div>
            ))}
        </div>
    );
};

export default HiringBoard;