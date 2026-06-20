// Main dashboard for viewing and managing the fee engine.
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FeeDashboard() {
    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <header className="mb-8 border-b pb-4">
                <h1 className="text-4xl font-bold text-gray-900">Platform Fee Engine</h1>
                <p className="text-lg text-gray-600 mt-2">Dynamic Fee Configuration</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="shadow-lg border-t-4 border-blue-500">
                    <CardHeader>
                        <CardTitle>Current On-Chain Fee</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-xl font-semibold text-blue-600">1.25% (Mock)</p>
                        <p>Basis Points: 1250</p>
                        <p className="text-sm text-gray-500 mt-2">Source: Blockchain State</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-t-4 border-green-500">
                    <CardHeader>
                        <CardTitle>Off-Chain Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <p className="text-xl font-semibold text-green-600">1.00% (Last Sync)</p>
                        <p>Basis Points: 100</p>
                        <p className="text-sm text-gray-500 mt-2">Source: Database Record</p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg border-t-4 border-yellow-500">
                    <CardHeader>
                        <CardTitle>Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p>Use the panel below to configure new fees.</p>
                        <Link href="/admin/set-fee" className="block w-full text-center py-2 px-4 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition">
                            Configure New Fee (Admin)
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl border">
                <h2 className="text-2xl font-semibold mb-4">Dynamic Update Panel</h2>
                <p className="mb-4 text-sm text-gray-700">Enter the desired fee in Basis Points (e.g., 500 for 5%) and submit to trigger the transaction.</p>

                <form action="/api/update-fee" method="post">
                    <div className="flex items-center space-x-4 mb-4">
                        <label htmlFor="newFeeBPS" className="block text-sm font-medium text-gray-700">New Fee (Basis Points):</label>
                        <input type="number" id="newFeeBPS" name="newFeeBPS" required 
                               placeholder="e.g., 500" 
                               className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                               min="1"
                               max="10000" />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-150">
                        Execute Fee Update Transaction
                    </Button>
                </form>

                <div id="result" className="mt-6 p-4 border-2 border-dashed rounded-lg hidden">
                    {/* Results will be injected here */}
                </div>
            </div>
        </div>
    );
}