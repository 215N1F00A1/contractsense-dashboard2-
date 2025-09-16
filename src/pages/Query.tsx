import React, { useState } from 'react';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  SparklesIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

interface QueryResult {
  answer: string;
  chunks: {
    id: string;
    text: string;
    metadata: {
      contract_name: string;
      page: number;
      confidence: number;
      relevance: number;
    };
  }[];
}

const Query = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<QueryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'What are the termination clauses in my contracts?',
    'Which contracts expire in the next 6 months?',
    'Show me all liability limitations',
    'What are the payment terms across contracts?',
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const mockResult: QueryResult = {
        answer: `Based on your contracts, I found several relevant clauses regarding "${query}". The termination clauses generally allow either party to terminate with 90 days' written notice. Most contracts include standard liability limitations that cap damages to 12 months of fees paid. Payment terms are typically net 30 days from invoice date.`,
        chunks: [
          {
            id: '1',
            text: 'Either party may terminate this agreement with ninety (90) days written notice to the other party.',
            metadata: {
              contract_name: 'Master Service Agreement - TechCorp',
              page: 2,
              confidence: 95,
              relevance: 98,
            },
          },
          {
            id: '2',
            text: 'In no event shall either party be liable for any amount in excess of the fees paid under this agreement in the twelve (12) months preceding the claim.',
            metadata: {
              contract_name: 'Software License Agreement - DataFlow',
              page: 5,
              confidence: 88,
              relevance: 85,
            },
          },
          {
            id: '3',
            text: 'Payment shall be made within thirty (30) days of receipt of invoice.',
            metadata: {
              contract_name: 'Consulting Agreement - Analytics Pro',
              page: 3,
              confidence: 92,
              relevance: 78,
            },
          },
          {
            id: '4',
            text: 'This agreement may be terminated by either party upon material breach, provided that the breaching party has not cured such breach within thirty (30) days.',
            metadata: {
              contract_name: 'Partnership Agreement - GlobalTech',
              page: 8,
              confidence: 91,
              relevance: 82,
            },
          },
        ],
      };

      setResult(mockResult);
      setLoading(false);

      // Add to recent queries
      if (!recentQueries.includes(query)) {
        setRecentQueries((prev) => [query, ...prev.slice(0, 3)]);
      }
    }, 2000);
  };

  const handleRecentQueryClick = (recentQuery: string) => {
    setQuery(recentQuery);
  };

  const getRelevanceColor = (relevance: number) => {
    if (relevance >= 90) return 'text-green-700 bg-green-100';
    if (relevance >= 70) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Query Interface</h1>
        <p className="text-gray-600">Ask natural language questions about your contracts</p>
      </div>

      {/* Query Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your contracts..."
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            disabled={loading}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-r-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Ask'}
            </button>
          </div>
        </div>
      </form>

      {/* Recent Queries */}
      {recentQueries.length > 0 && !result && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Queries</h3>
          <div className="grid gap-2">
            {recentQueries.map((recentQuery, index) => (
              <button
                key={index}
                onClick={() => handleRecentQueryClick(recentQuery)}
                className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start space-x-2">
                  <ClockIcon className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{recentQuery}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center space-x-3">
            <LoadingSpinner size="md" />
            <span className="text-gray-600">Searching through your contracts...</span>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Embedding your query...</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Searching vector database...</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span>Generating AI response...</span>
            </div>
          </div>
        </div>
      )}

      {/* Query Results */}
      {result && !loading && (
        <div className="space-y-6">
          {/* AI Answer */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <SparklesIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Answer</h3>
                <p className="text-gray-700 leading-relaxed">{result.answer}</p>
              </div>
            </div>
          </div>

          {/* Retrieved Chunks */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Retrieved Evidence ({result.chunks.length} chunks)
            </h3>
            <div className="space-y-4">
              {result.chunks.map((chunk, index) => (
                <div key={chunk.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {chunk.metadata.contract_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Page {chunk.metadata.page}</span>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRelevanceColor(
                          chunk.metadata.relevance
                        )}`}
                      >
                        {chunk.metadata.relevance}% relevance
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{chunk.text}</p>
                  <div className="text-xs text-gray-500">
                    Confidence: {chunk.metadata.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* New Query Button */}
          <div className="text-center">
            <button
              onClick={() => {
                setResult(null);
                setQuery('');
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ask Another Question
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <MagnifyingGlassIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ask AI About Your Contracts</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use natural language to query your contract database. Ask about termination clauses, 
            payment terms, liability limitations, expiration dates, and more.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="text-left p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Example Queries</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• "What are the termination clauses?"</li>
                <li>• "Show me liability limitations"</li>
                <li>• "Which contracts expire soon?"</li>
              </ul>
            </div>
            <div className="text-left p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">AI Capabilities</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Semantic search across all contracts</li>
                <li>• Contextual understanding</li>
                <li>• Evidence-based answers</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Query;