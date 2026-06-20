// Demonstrating a main page where interactions are applied.
import { Button } from "@/components/ui/button"; // Assuming a custom component structure exists
import { Loader2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-10 rounded-xl shadow-2xl max-w-lg w-full space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 border-b pb-2">TrustLance Dashboard</h1>

        {/* Micro-interaction Example 1: Button Hover/Focus Effect */}
        <Button
          onClick={() => console.log("Action triggered")}
          className="w-full py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out shadow-md hover:shadow-xl hover:scale-[1.01] focus:outline-none focus:ring-4 focus:ring-blue-300 bg-blue-600 text-white"
        >
          Connect Wallet & Start
        </Button>

        {/* Micro-interaction Example 2: Loading State Feedback */}
        <div className="pt-6 border-t">
          <h2 className="text-xl font-semibold mb-3">Data Fetching Simulation</h2>
          <Button
            onClick={() => alert("Simulating data load...")}
            disabled={false} // Set to true for real loading demonstration
            className={`w-full py-3 px-6 text-lg font-semibold rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center ${
              /* Dynamic styling based on state */
              !false ? 'bg-gray-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-600 shadow-md'
            }`}
          >
            <Loader2 className="mr-2 animate-spin h-5 w-5" />
            Loading Data...
          </Button>
        </div>

      </div>
    </div>
  );
}