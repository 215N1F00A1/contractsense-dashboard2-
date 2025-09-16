import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import {
  DocumentTextIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Reports = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('6m');

  const contractsByStatus = [
    { name: 'Active', value: 18, color: '#10B981' },
    { name: 'Renewal Due', value: 3, color: '#F59E0B' },
    { name: 'Expired', value: 2, color: '#EF4444' },
    { name: 'Under Review', value: 1, color: '#8B5CF6' },
  ];

  const riskDistribution = [
    { name: 'Low Risk', contracts: 12, color: '#10B981' },
    { name: 'Medium Risk', contracts: 8, color: '#F59E0B' },
    { name: 'High Risk', contracts: 4, color: '#EF4444' },
  ];

  const contractsOverTime = [
    { month: 'Jan', contracts: 15, value: 2400000 },
    { month: 'Feb', contracts: 18, value: 2800000 },
    { month: 'Mar', contracts: 20, value: 3200000 },
    { month: 'Apr', contracts: 22, value: 3500000 },
    { month: 'May', contracts: 23, value: 3800000 },
    { month: 'Jun', contracts: 24, value: 4200000 },
  ];

  const expiringContracts = [
    { month: 'Mar 2024', count: 2 },
    { month: 'Apr 2024', count: 1 },
    { month: 'May 2024', count: 3 },
    { month: 'Jun 2024', count: 2 },
    { month: 'Jul 2024', count: 1 },
    { month: 'Aug 2024', count: 4 },
  ];

  const topContractors = [
    { name: 'TechCorp LLC', contracts: 4, value: 850000, risk: 'Low' },
    { name: 'DataFlow Systems', contracts: 3, value: 620000, risk: 'Medium' },
    { name: 'Analytics Pro Ltd.', contracts: 2, value: 450000, risk: 'High' },
    { name: 'GlobalTech Solutions', contracts: 3, value: 380000, risk: 'High' },
    { name: 'Innovation Labs', contracts: 2, value: 280000, risk: 'Low' },
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

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

  const stats = [
    {
      name: 'Total Contract Value',
      value: '$4.2M',
      change: '+12%',
      changeType: 'increase',
      icon: DocumentTextIcon,
    },
    {
      name: 'Average Contract Value',
      value: '$175K',
      change: '+5%',
      changeType: 'increase',
      icon: ChartBarIcon,
    },
    {
      name: 'Contracts Expiring (90 days)',
      value: '3',
      change: '0',
      changeType: 'neutral',
      icon: CalendarDaysIcon,
    },
    {
      name: 'High Risk Contracts',
      value: '4',
      change: '-1',
      changeType: 'decrease',
      icon: ExclamationTriangleIcon,
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600">Comprehensive insights into your contract portfolio</p>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="1y">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Contract Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contractsByStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {contractsByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {contractsByStatus.map((item) => (
              <div key={item.name} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-700">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contracts" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Contract Growth */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Portfolio Growth</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={contractsOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'value') {
                    return [formatCurrency(Number(value)), 'Contract Value'];
                  }
                  return [value, 'Contracts Count'];
                }}
              />
              <Bar yAxisId="left" dataKey="contracts" fill="#3B82F6" radius={[2, 2, 0, 0]} />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="value" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expiring Contracts */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contract Expirations by Month</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expiringContracts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Contractors */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Contractors by Value</h3>
          <div className="space-y-4">
            {topContractors.map((contractor, index) => (
              <div key={contractor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{contractor.name}</div>
                  <div className="text-sm text-gray-500">
                    {contractor.contracts} contracts • {formatCurrency(contractor.value)}
                  </div>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(
                    contractor.risk
                  )}`}
                >
                  {contractor.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Insights */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-blue-800">Portfolio Growth:</span>
            <p className="text-blue-700 mt-1">
              Contract value has grown 12% over the last 6 months, with steady addition of new agreements.
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Risk Management:</span>
            <p className="text-blue-700 mt-1">
              83% of contracts are low to medium risk, indicating good risk management practices.
            </p>
          </div>
          <div>
            <span className="font-medium text-blue-800">Renewal Planning:</span>
            <p className="text-blue-700 mt-1">
              3 high-value contracts require renewal attention in the next 90 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;