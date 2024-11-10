'use client'
import { useState } from 'react';
import { Upload } from 'lucide-react';
import Image from 'next/image';

interface ScoreDetail {
  score: number;
  rationale: string;
}

interface AnalysisData {
  summary: string;
  geography: string;
  industry: string;
  stage: string;
  total_score: number;
  team_score: Record<string, ScoreDetail>;
  business_model_score: Record<string, ScoreDetail>;
  traction_score: Record<string, ScoreDetail>;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze pitch deck. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderScoreCard = (title: string, scores: Record<string, ScoreDetail>) => {
    return (
      <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-purple-600 bg-opacity-80 rounded-lg shadow-lg p-6 mb-4">
        <h3 className="text-2xl font-semibold text-white mb-4">{title}</h3>
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
              <span className="font-semibold text-white">
                {value.score} / 1.0
              </span>
            </div>
            <p className="text-sm text-gray-300">{value.rationale}</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-screen w-screen antialiased bg-gradient-to-r from-black to-gray-900 text-white">
      <div className="flex h-screen flex-col md:flex-row">
        {/* Left Side - Upload Section */}
        <div className="flex-1 lg:mt-20 p-10 md:p-20">
          <h1 className="text-5xl font-bold text-center md:text-left text-purple-500">
            Contrarian Ventures
          </h1>
          <p className="mt-4 text-xl font-medium text-center md:text-left text-white">
            Pitch Deck Analyzer. Upload your pitch deck for analysis.
          </p>

          <div className="mt-8 bg-gray-800 bg-opacity-80 rounded-lg shadow-lg p-8">
            <div className="flex flex-col items-center justify-center">
              <label className="w-full flex flex-col items-center text-blue-300 px-4 py-6 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 rounded-lg shadow-xl tracking-wide border border-blue-500 cursor-pointer hover:bg-opacity-80 transition-colors">
                <Upload className="w-10 h-10 animate-bounce" />
                <span className="mt-2 text-lg font-semibold">
                  {file ? file.name : 'Choose a file'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="mt-6 w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition duration-300 ease-in-out disabled:bg-purple-400"
            >
              {loading ? 'Analyzing...' : 'Analyze Pitch Deck'}
            </button>
          </div>
        </div>

        <div className="flex-1 shrink-0 relative overflow-hidden">
          <Image
            src="/unicorn.jpg"
            alt="Analyzer Banner"
            layout="fill"
            objectFit="cover"
            className="brightness-75 hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>


      {analysis && (
        <div className="mt-12 p-8 rounded-lg shadow-lg mx-10 lg:mx-20">
          <h2 className="text-4xl font-bold text-purple-400 mb-6 text-center">Evaluation</h2>
          <p className="mt-4 text-xl font-medium text-center md:text-left text-white">
            {analysis.summary}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 p-6 rounded-lg shadow-md">
              <p className="text-lg font-semibold">Geography</p>
              <p className="text-xl font-bold text-white">{analysis.geography}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 p-6 rounded-lg shadow-md">
              <p className="text-lg font-semibold">Industry</p>
              <p className="text-xl font-bold text-white">{analysis.industry}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 p-6 rounded-lg shadow-md">
              <p className="text-lg font-semibold">Stage</p>
              <p className="text-xl font-bold text-white">{analysis.stage}</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-xl font-semibold text-gray-300">Total Score</p>
            <p className="text-5xl font-bold text-purple-400">
              {analysis.total_score.toFixed(1)} / 10.0
            </p>
          </div>
          <br />

          {renderScoreCard('Team Assessment', analysis.team_score)}
          {renderScoreCard('Business Model Assessment', analysis.business_model_score)}
          {renderScoreCard('Traction Assessment', analysis.traction_score)}
        </div>
      )}
    </div>
  );
}
