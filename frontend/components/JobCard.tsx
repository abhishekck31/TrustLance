import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface JobListItem {
    id: string
    title: string
    salary: number
    postedDate: string
}

interface JobCardProps {
    job: JobListItem
}

export function JobCard({ job }: JobCardProps) {
    return (
        <Card className="shadow-md hover:shadow-lg transition duration-300 border-t-4 border-blue-500">
            <CardContent className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">Contract {job.id}</span>
                </div>
                <div className="pt-2 border-t">
                    <p className="text-lg font-semibold text-gray-800">Salary Offered</p>
                    <p className="text-3xl font-extrabold text-green-600">${job.salary.toLocaleString()}</p>
                </div>
                <div className="flex justify-between pt-4 border-t mt-4">
                    <p className="text-sm text-gray-500">Posted Date</p>
                    <p className="font-medium text-gray-700">{job.postedDate}</p>
                    <Link href={`/jobs/${job.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition shadow">
                        View Job Details
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}