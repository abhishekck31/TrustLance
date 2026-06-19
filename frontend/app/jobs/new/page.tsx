import { motion } from "framer-motion"
import Link from "next"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

// Placeholder for hypothetical contract interaction state
interface CreateJobFormState {
    title: string
    description: string
    salary: number
}

export default function CreateJobPage() {
    const router = useRouter()

    const handleSubmit = (formData: CreateJobFormState) => {
        console.log("Submitting job data:", formData)
        // In a real app, this would trigger a transaction via wallet interaction
        alert("Job submitted successfully (Simulation)")
        router.push("/jobs")
    }

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 max-w-3xl mx-auto bg-white shadow-lg rounded-xl mt-10"
        >
            <h1 className="text-4xl font-bold text-gray-900 mb-6 border-b pb-2">Create New Job Posting</h1>
            <p className="text-gray-600 mb-8">Fill out the details to list your job on TrustLance.</p>

            <form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit({
                    title: (document.getElementById('title') as HTMLInputElement).value,
                    description: (document.getElementById('description') as HTMLTextAreaElement).value,
                    salary: parseFloat((document.getElementById('salary') as HTMLInputElement).value)
                })
            }} className="space-y-6">
                <div>
                    <Label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</Label>
                    <Input id="title" type="text" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                    <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Job Description</Label>
                    <textarea id="description" rows={6} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                </div>
                <div>
                    <Label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary (USD)</Label>
                    <Input id="salary" type="number" step="0.01" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-150 shadow-md">
                    Post Job to Contract
                </Button>
            </form>
        </motion.div>
    )
}