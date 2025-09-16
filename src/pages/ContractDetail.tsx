import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

interface Contract {
  id: string;
  name: string;
  parties: string[];
  expiryDate: string;
  status: 'Active' | 'Renewal Due' | 'Expired';
  riskLevel: 'Low' | 'Medium' | 'High';
  uploadDate: string;
  fileSize: string;
  pageCount: number;
}

interface Clause {
  id: string;
  title: string;
  text: string;
  confidence: number;
  page: number;
  category: string;
}

interface Insight {
  id: string;
  type: 'risk' | 'opportunity' | 'recommendation';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

interface Evidence {
  id: string;
  text: string;
  page: number;
  relevance: number;
  context: string;
}

const ContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<Contract | null>(null);
  const [clauses, setClauses] = useState<Clause[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'clauses' | 'insights' | 'evidence'>('clauses');

  useEffect(() => {
    // Mock data - in real app, this would fetch from your API
    const mockContract: Contract = {
      id: id || '1',
      name: 'Master Service Agreement - TechCorp',
      parties: ['Company Inc.', 'TechCorp LLC'],
      expiryDate: '2024-12-15',
      status: 'Active',
      riskLevel: 'Low',
      uploadDate: '2024-01-15',
      fileSize: '2.4 MB',
      pageCount: 12,
    };

    const mockClauses: Clause[] = [
      {
        id: '1',
        title: 'Termination Clause',
        text: 'Either party may terminate this agreement with ninety (90) days written notice to the other party.',
        confidence: 95,
        page: 2,
        category: 'Termination',
      },
      {
        id: '2',
        title: 'Liability Limitation',
        text: 'In no event shall either party be liable for any indirect, incidental, special, or consequential damages.',
        confidence: 88,
        page: 5,
        category: 'Liability',
      },
      {
        id: '3',
        title: 'Payment Terms',
        text: 'Payment shall be made within thirty (30) days of receipt of invoice.',
        confidence: 92,
        page: 3,
        category: 'Payment',
      },
      {
        id: '4',
        title: 'Intellectual Property',
        text: 'Each party retains ownership of their respective intellectual property rights.',
        confidence: 85,
        page: 7,
        category: 'IP',
      },
    ];

    const mockInsights: Insight[] = [
      {
        id: '1',
        type: 'risk',
        title: 'Broad Liability Limitation',
        description: 'The liability limitation clause is very broad and may prevent recovery of legitimate damages.',
        severity: 'medium',
      },
      {
        id: '2',
        type: 'opportunity',
        title: 'Favorable Payment Terms',
        description: 'The 30-day payment terms are standard and reasonable for your business.',
        severity: 'low',
      },
      {
        id: '3',
        type: 'recommendation',
        title: 'Add Force Majeure Clause',
        description: 'Consider adding a force majeure clause to protect against unforeseen circumstances.',
        severity: 'high',
      },
    ];

    const mockEvidence: Evidence[] = [
      {
        id: '1',
        text: 'Termination clause: Either party may terminate with 90 days\' notice.',
        page: 2,
        relevance: 95,
        context: 'Section 8.1 - Termination for Convenience',
      },
      {
        id: '2',
        text: 'Liability cap: Limited to 12 months\' fees.',
        page: 5,
        relevance: 88,
        context: 'Section 12.3 - Limitation of Liability',
      },
      {
        id: '3',
        text: 'Payment terms: Net 30 days from invoice date.',
        page: 3,
        relevance: 92,
        context: 'Section 4.2 - Payment Terms',
      },
    ];

    setTimeout(() => {
      setContract(mockContract);
      setClauses(mockClauses);
      setInsights(mockInsights);
      setEvidence(mockEvidence);
      setLoading(false);
    }, 1000);
  }, [id]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High':
        return 'text-red-700 bg-red-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'Low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-green-700 bg-green-100';
      case 'Renewal Due':
        return 'text-yellow-700 bg-yellow-100';
      case 'Expired':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return ExclamationTriangleIcon;
      case 'opportunity':
        return CheckCircleIcon;
      case 'recommendation':
        return InformationCircleIcon;
      default:
        return InformationCircleIcon;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Contract not found</h3>
          <p className="mt-1 text-sm text-gray-500">The requested contract could not be found.</p>
          <div className="mt-6">
            <Link
              to="/contracts"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Contracts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/contracts"
            className="mr-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{contract.name}</h1>
            <p className="text-gray-600">Contract details and analysis</p>
          </div>
        </div>

        {/* Contract Metadata */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    contract.status
                  )}`}
                >
                  {contract.status}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Risk Level</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(
                    contract.riskLevel
                  )}`}
                >
                  {contract.riskLevel}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Expiry Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.expiryDate).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Upload Date</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {new Date(contract.uploadDate).toLocaleDateString()}
              </dd>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Parties</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.parties.join(', ')}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">File Size</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.fileSize}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Pages</dt>
                <dd className="mt-1 text-sm text-gray-900">{contract.pageCount}</dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('clauses')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'clauses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Clauses ({clauses.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'insights'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Insights ({insights.length})
            </button>
            <button
              onClick={() => setActiveTab('evidence')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'evidence'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Evidence ({evidence.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'clauses' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clauses.map((clause) => (
            <div key={clause.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">{clause.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Page {clause.page}</span>
                  <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {clause.confidence}% confidence
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-3">{clause.text}</p>
              <div className="flex items-center justify-between">
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  {clause.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-4">
          {insights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div key={insight.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-start space-x-3">
                  <Icon className="h-6 w-6 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(
                          insight.severity
                        )}`}
                      >
                        {insight.severity} {insight.type}
                      </span>
                    </div>
                    <p className="text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'evidence' && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Retrieved Evidence Snippets</h3>
            <div className="space-y-4">
              {evidence.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-sm text-gray-500">{item.context}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Page {item.page}</span>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        {item.relevance}% relevance
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-900">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractDetail;