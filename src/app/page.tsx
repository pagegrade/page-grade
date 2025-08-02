'use client';

import { useState } from 'react';
import { PageGradeForm } from '@/components/PageGradeForm';
import { FeedbackReport } from '@/components/FeedbackReport';

export default function Home() {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (url: string) => {
    setLoading(true);
    setError('');
    setFeedback(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze page');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <img 
              src="/pagegradelogo.png" 
              alt="PageGrade Logo" 
              className="h-16 w-auto"
              style={{ imageRendering: 'crisp-edges' }}
            />
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get instant AI-powered feedback on your landing page. Paste your URL and receive a detailed analysis with actionable insights to improve conversion rate.
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <PageGradeForm onSubmit={handleSubmit} loading={loading} />
          
          {/* Error Display */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing your landing page...
              </div>
            </div>
          )}

          {/* Feedback Report */}
          {feedback && <FeedbackReport feedback={feedback} />}
        </div>
      </div>
    </div>
  );
}
