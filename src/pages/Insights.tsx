import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

const Insights = () => {
  const insights = [
    {
      id: '1',
      type: 'risk',
      title: 'High Liability Exposure',
      description: 'Several contracts lack adequate liability caps, potentially exposing the company to significant financial risk.',
      contracts: ['Software License Agreement - DataFlow', 'Partnership Agreement - GlobalTech'],
      severity: 'high',
      recommendation: 'Review and negotiate liability limitation clauses in the identified contracts.',
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Favorable Payment Terms',
      description: 'Your contracts generally include favorable payment terms with standard 30-day payment periods.',
      contracts: ['Master Service Agreement - TechCorp', 'Consulting Agreement - Analytics Pro'],
      severity: 'low',
      recommendation: 'Continue negotiating similar terms in future contracts.',
    },
    {
      id: '3',
      type: 'risk',
      title: 'Missing Force Majeure Clauses',
      description: '40% of your contracts lack force majeure provisions, leaving you vulnerable to unforeseen circumstances.',
      contracts: ['NDA - Innovation Labs', 'Equipment Lease - MachineWorks'],
      severity: 'medium',
      recommendation: 'Add comprehensive force majeure clauses to protect against external disruptions.',
    },
    {
      id: '4',
      type: 'opportunity',
      title: 'Strong IP Protection',
      description: 'Most contracts have well-defined intellectual property clauses that protect your interests.',
      contracts: ['Master Service Agreement - TechCorp', 'Software License Agreement - DataFlow'],
      severity: 'low',
      recommendation: 'Use these IP clauses as templates for future contracts.',
    },
    {
      id: '5',
      type: 'risk',
      title: 'Upcoming Renewals',
      description: '3 contracts require renewal attention within the next 90 days to avoid service disruptions.',
      contracts: ['Software License Agreement - DataFlow', 'Equipment Lease - MachineWorks'],
      severity: 'high',
      recommendation: 'Begin renewal negotiations immediately to secure favorable terms.',
    },
    {
      id: '6',
      type: 'recommendation',
      title: 'Standardize Termination Clauses',
      description: 'Termination notice periods vary widely across contracts, creating administrative complexity.',
      contracts: ['All active contracts'],
      severity: 'medium',
      recommendation: 'Establish standard termination notice periods (e.g., 90 days) for consistency.',
    },
  ];

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'risk':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'opportunity':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'recommendation':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
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

  const stats = [
    {
      name: 'Total Insights',
      value: insights.length,
      icon: ChartBarIcon,
      color: 'text-blue-600',
    },
    {
      name: 'High Priority',
      value: insights.filter(i => i.severity === 'high').length,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
    },
    {
      name: 'Opportunities',
      value: insights.filter(i => i.type === 'opportunity').length,
      icon: CheckCircleIcon,
      color: 'text-green-600',
    },
    {
      name: 'Recommendations',
      value: insights.filter(i => i.type === 'recommendation').length,
      icon: InformationCircleIcon,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600">AI-powered analysis of risks, opportunities, and recommendations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insights List */}
      <div className="space-y-6">
        {insights.map((insight) => {
          const Icon = getTypeIcon(insight.type);
          return (
            <div
              key={insight.id}
              className={`bg-white rounded-lg shadow border-l-4 ${getTypeColor(insight.type)}`}
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getSeverityColor(insight.severity)}`}>
                          {insight.severity} {insight.type}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{insight.description}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Affected Contracts:</h4>
                      <div className="flex flex-wrap gap-2">
                        {insight.contracts.map((contract, index) => (
                          <span
                            key={index}
                            className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md"
                          >
                            {contract}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-md p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendation:</h4>
                      <p className="text-sm text-gray-700">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">High Priority Actions:</span>
            <p className="text-blue-700 mt-1">
              Focus on liability exposure and upcoming renewals to mitigate immediate risks.
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Process Improvements:</span>
            <p className="text-blue-700 mt-1">
              Standardize clauses and templates based on successful contract patterns.
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Overall Health:</span>
            <p className="text-blue-700 mt-1">
              Your contract portfolio shows strong IP protection with manageable risk areas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insights;