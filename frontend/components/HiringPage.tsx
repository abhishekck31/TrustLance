'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'

interface Opportunity {
  id: number
  title: string
  description: string
  location: string
  type: string
  postedAt: string
  salary?: string | null
}

interface HiringPageProps {
  opportunities: Opportunity[]
}

export default function HiringPage({ opportunities }: HiringPageProps) {
  const [opps, setOpportunities] = useState<Opportunity[]>(opportunities || [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Assuming the backend runs on http://localhost:3000
        const response = await fetch('http://localhost:3000/api/hiring')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setOpportunities(data)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to load hiring opportunities. Please check the backend connection.')
      } finally {
        setLoading(false)
      }
    }
    fetchOpportunities()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-xl text-indigo-600">
        <Loader2 className="w-8 h-8 animate-spin mr-3" /> Loading Opportunities...
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md">
        <AlertTriangle className="w-6 h-6 mr-3" /> {error}
      </div>
    )
  }

  if (opps.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-md border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No Opportunities Found</h2>
        <p className="text-gray-600">There are currently no public hiring opportunities posted.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {opps.map((opp) => (
        <div key={opp.id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
          <div className="flex justify-between items-start mb-3 border-b pb-2">
            <h2 className="text-2xl font-bold text-indigo-700">{opp.title}</h2>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                opp.type === 'Full-time' ? 'bg-green-100 text-green-800' : 
                opp.type === 'Contract' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
            }`}>
              {opp.type}
            </span>
          </div>
          <p className="text-gray-700 mb-3 border-l-4 border-indigo-300 pl-3 italic">{opp.description}</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 pt-2">
            <div className="flex items-center">
              <span className="font-medium text-gray-500 w-24">Location:</span>
              <span>{opp.location}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-500 w-24">Type:</span>
              <span>{opp.type}</span>
            </div>
            {opp.salary && (
               <div className="flex items-center">
                <span className="font-medium text-gray-500 w-24">Salary Estimate:</span>
                <span className={`font-bold ${opp.salary.includes('000') ? 'text-green-600' : 'text-gray-800'}`}>{opp.salary}</span>
              </div>
            )}
          </div>
          <p className="mt-4 pt-3 border-t text-sm text-gray-500">Posted on: {new Date(opp.postedAt).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  )
}