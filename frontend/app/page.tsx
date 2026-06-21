"use client"

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input"; // Assuming shadcn components setup
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define the structure for a single freelancer result
interface Freelancer {
    id: string;
    name: string;
    skill: string;
    rating: number;
}

export default function HomePage() {
    const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [skillFilter, setSkillFilter] = useState("");
    const [error, setError] = useState<string | null>(null);

    const API_URL = "http://localhost:3001/api";

    const fetchFreelancers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Construct the query based on state
            const params = new URLSearchParams();
            if (searchTerm) {
                params.append("searchName", searchTerm);
            }
            if (skillFilter) {
                params.append("searchSkill", skillFilter);
            }

            const response = await axios.get(`${API_URL}/freelancers?${params.toString()}`);
            setFreelancers(response.data);
        } catch (err) {
            setError("Failed to fetch freelancers. Is the backend running?");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, skillFilter]);

    // Initial load and debounced search handler would go here in a full implementation
    useEffect(() => {
        fetchFreelancers();
    }, [fetchFreelancers]);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchFreelancers();
    };

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Freelancer Discovery Engine</h1>
                <p className="text-lg text-gray-600">Find top talent based on skills and reputation.</p>
            </header>

            {/* Search and Filter Panel */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border">
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
                            <Input
                                id="name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="e.g., Developer"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">Filter by Skill</label>
                            <Input
                                id="skill"
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                                placeholder="e.g., Solidity"
                                className="w-full"
                            />
                        </div>
                         <div className="flex items-end">
                            <Button type="submit" className="w-full">
                                <Search className="w-4 h-4 mr-2" /> Search
                            </Button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </div>

            {/* Results Display */}
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Discovery Results ({freelancers.length})</h2>

            {loading && <div className="flex justify-center items-center py-10"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading...</div>}

            {!loading && freelancers.length === 0 && (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500">No freelancers found matching your criteria.</p>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                {freelancers.map((f) => (
                    <Card key={f.id} className="shadow-lg transition duration-300 hover:shadow-xl border-l-4 border-blue-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-semibold">{f.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center font-bold text-blue-600">
                                    <Filter className="w-4 h-4 mr-1" /> Skill: {f.skill}
                                </span>
                                <span className="flex items-center font-bold text-green-600">
                                    <Search className="w-4 h-4 mr-1" /> Rating: {f.rating}/5
                                </span>
                            </div>
                            <p className="text-sm italic">{f.bio}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}