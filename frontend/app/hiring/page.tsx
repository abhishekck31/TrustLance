import HiringPage from '@/components/HiringPage'

export default function HiringDiscoveryPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="text-center mb-12 border-b pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900">Public Hiring Discovery</h1>
        <p className="mt-2 text-lg text-gray-600">Explore exciting Web3 and blockchain opportunities.</p>
      </header>
      <main>
        <HiringPage />
      </main>
    </div>
  )
}