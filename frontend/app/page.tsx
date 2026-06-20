'use client';

import { useState } from 'react';
import { analyzeEvidence } from '@/api/evidenceApi'; // Assuming API wrapper exists
import { Loader2, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function HomePage() {
  const [title, setTitle] = useState('');
  const [evidenceText, setEvidenceText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!title || !evidenceText) {
      setError("Please provide both a title and evidence text.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      // Send data to the backend analysis endpoint
      const response = await analyzeEvidence(title, evidenceText);
      setAnalysis(response);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred during analysis.");
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900">AI Dispute Evidence Analyzer</h1>
        <p className="mt-2 text-xl text-gray-600">Analyze submissions and evidence using AI summarization.</p>
      </header>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Submit Evidence for Analysis</h2>

        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Dispute Title</label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
              placeholder="Enter the dispute title"
            />
          </div>

          {/* Evidence Submission */}
          <div>
            <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">Submission/Evidence Text</label>
            <textarea
              id="evidence"
              rows={15}
              value={evidenceText}
              onChange={(e) => setEvidenceText(e.target.value)}
              className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm resize-y"
              placeholder="Paste the full text of the submission, documents, or evidence here..."
            />
          </div>

          {/* Analysis Button */}
          <Button 
            onClick={handleAnalyze} 
            disabled={isLoading || !title || !evidenceText}
            className={`w-full flex items-center justify-center gap-2 transition duration-150 ${isLoading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white shadow-md`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5" /> Analyze Evidence
              </>
            )}
          </Button>

          {/* Results Display */}
          {analysis && (
            <Card className="mt-8 border-l-4 border-indigo-500 shadow-lg animate-in fade-in duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold text-indigo-700">AI Analysis Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-gray-600 mb-3">Summary Generated:</p>
                <div className="whitespace-pre-wrap bg-indigo-50 p-4 rounded-lg border border-indigo-200 text-gray-800">{analysis.summary}</div>
              </CardContent>
            </Card>
          )}

          {error && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}