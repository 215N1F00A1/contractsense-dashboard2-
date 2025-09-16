import React from 'react';
import { Link } from 'react-router-dom';
import {
  DocumentTextIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const stats = [
    {
      name: 'Total Contracts',
      value: '24',
      change: '+2',
      changeType: 'increase',
      icon: DocumentTextIcon,
    },
    {
      name: 'Active Contracts',
      value: '18',
      change: '+1',
      changeType: 'increase',
      icon: CheckCircleIcon,
    },
    {
      name: 'Renewal Due',
      value: '3',
      change: '0',
      changeType: 'neutral',
      icon: ClockIcon,
    },
    {
      name: 'High Risk',
      value: '2',
      change: '-1',
      changeType: 'decrease',
      icon: ExclamationTriangleIcon,
    },
  ];

  const recentContracts = [
    {
      id: '1',
      name: 'Master Service Agreement - TechCorp',
      status: 'Active',
      expiryDate: '2024-12-15',
      riskLevel: 'Low',
      parties: ['Company Inc.', 'TechCorp LLC'],
    },
    {
      id: '2',
      name: 'Software License Agreement - DataFlow',
      status: 'Renewal Due',
      expiryDate: '2024-03-01',
      riskLevel: 'Medium',
      parties: ['Company Inc.', 'DataFlow Systems'],
    },
    {
      id: '3',
      name: 'Consulting Agreement - Analytics Pro',
      status: 'Active',
      expiryDate: '2024-08-30',
      riskLevel: 'High',
      parties: ['Company Inc.', 'Analytics Pro Ltd.'],
    },
    {
      id: '4',
      name: 'NDA - Innovation Labs',
      status: 'Active',
      expiryDate: '2025-01-15',
      riskLevel: 'Low',
      parties: ['Company Inc.', 'Innovation Labs'],
    },
  ];

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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your contract portfolio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold">
                        {stat.changeType === 'increase' ? (
                          <ArrowUpIcon className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                        ) : stat.changeType === 'decrease' ? (
                          <ArrowDownIcon className="self-center flex-shrink-0 h-4 w-4 text-red-500" />
                        ) : null}
                        <span
                          className={
                            stat.changeType === 'increase'
                              ? 'text-green-600'
                              : stat.changeType === 'decrease'
                              ? 'text-red-600'
                              : 'text-gray-500'
                          }
                        >
                          {stat.change}
                        </span>
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contracts */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Contracts</h2>
              <Link
                to="/contracts"
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                View all
              </Link>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="text-left py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {contract.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {contract.parties.join(' • ')}
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {contract.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(
                            contract.riskLevel
                          )}`}
                        >
                          {contract.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-900">
                        {new Date(contract.expiryDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/upload"
                className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <DocumentTextIcon className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium text-blue-900">Upload Contract</div>
                  <div className="text-sm text-blue-600">Add a new contract to analyze</div>
                </div>
              </Link>
              <Link
                to="/query"
                className="flex items-center p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
              >
                <ChartBarIcon className="h-6 w-6 text-green-600 mr-3" />
                <div>
                  <div className="font-medium text-green-900">AI Query</div>
                  <div className="text-sm text-green-600">Ask questions about your contracts</div>
                </div>
              </Link>
              <Link
                to="/insights"
                className="flex items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <ExclamationTriangleIcon className="h-6 w-6 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium text-purple-900">View Insights</div>
                  <div className="text-sm text-purple-600">Analyze risks and opportunities</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;