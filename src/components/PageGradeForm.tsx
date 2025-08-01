'use client';

import { useState } from 'react';

interface PageGradeFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export function PageGradeForm({ onSubmit, loading }: PageGradeFormProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onSubmit(url.trim());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Analyze Your Landing Page
        </h2>
        <p className="text-gray-600">
          Paste the URL of your landing page below to get instant AI feedback
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
            Landing Page URL
          </label>
                     <input
             type="url"
             id="url"
             value={url}
             onChange={(e) => setUrl(e.target.value)}
             placeholder="https://example.com"
             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-900 placeholder-gray-500"
             required
             disabled={loading}
           />
        </div>

                        <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="w-full bg-[#0DCC0C] hover:bg-[#0BB00A] disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                >
                  {loading ? 'Analyzing...' : 'Get Feedback'}
                </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">What we analyze:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Headlines and messaging clarity</li>
          <li>• Call-to-action effectiveness</li>
          <li>• Page structure and flow</li>
          <li>• Overall user experience</li>
        </ul>
      </div>
    </div>
  );
} 