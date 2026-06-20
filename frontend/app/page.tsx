// Main page component to display featured content.
import FeaturedTalentList from '../components/FeaturedTalentList';
import { TalentModel } from '../types'; // Assuming types are defined or imported

// Mock data fetch simulating an API call in a real Next.js app using getServerSideProps or Client components fetching data directly
async function getFeaturedData(): Promise<TalentModel[]> {
    // In a real application, this would be an actual fetch call to the backend API: /api/talents/featured
    console.log("Fetching featured data from backend...");
    
    // Mock Data for demonstration purposes:
    return [
        { id: 101, name: "Alice Developer", description: "Expert in Solidity and DeFi protocols.", isFeatured: true },
        { id: 102, name: "Bob Designer", description: "Award-winning UI/UX specialist for Web3 interfaces.", isFeatured: true },
        { id: 103, name: "Charlie Coder", description: "Master of smart contract optimization and security.", isFeatured: true },
    ];
}

export default async function HomePage() {
    const featuredTalents = await getFeaturedData();

    return (
        <main className="p-8 bg-gray-50 min-h-screen">
            <header className="mb-12 border-b pb-6">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-3">Featured Talents</h1>
                <p className="text-xl text-gray-600">Discover the top, most visible experts in the Web3 space.</p>
            </header>

            <section>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Top Showcase</h2>
                {/* Display the featured list component */}
                <FeaturedTalentList talents={featuredTalents} />
            </section>
        </main>
    );
}