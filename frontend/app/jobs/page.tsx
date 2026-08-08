import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

// Placeholder for Job data structure
interface JobListItem {
    id: string
    title: string
    salary: number
    postedDate: string
}

// Simulate fetching job listings
async function fetchJobListings(): Promise<JobListItem[]> {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    return [
        { id: "123", title: "Senior Web3 Developer", salary: 150000, postedDate: "2024-06-01" },
        { id: "456", title: "Blockchain Analyst", salary: 95000, postedDate: "2024-05-15" },
        { id: "789", title: "Smart Contract Auditor", salary: 120000, postedDate: "2024-06-10" },
    ]
}

export default async function JobListingPage() {
    const jobs = await fetchJobListings()

    return (
        <div className="p-8 max-w-6xl mx-auto mt-10">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-5xl font-extrabold text-gray-900">Job Listings</h1>
                <Link href="/jobs/new" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition shadow-md">
                    Post a Job
                </Link>
            </div>

            {jobs.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-xl shadow-md mt-8">
                    <p className="text-xl text-gray-500">No job listings found at this time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <Card key={job.id} className="shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-blue-500">
                            <CardHeader>
                                <CardTitle className="text-2xl font-bold text-gray-900">{job.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-2">
                                <p className="text-sm text-gray-600 mb-2"><strong>Salary:</strong> <span className="text-green-600">${job.salary.toLocaleString()}</span></p>
                                <p className="text-sm text-gray-500">Posted: {job.postedDate}</p>
                                <Link href={`/jobs/${job.id}`} className="mt-4 inline-block text-blue-600 font-medium hover:text-blue-800 transition">
                                    View Details & Contract
                                </Link>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}