import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  EyeIcon,
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
}

const Contracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data - in real app, this would come from your API
  useEffect(() => {
    const mockContracts: Contract[] = [
      {
        id: '1',
        name: 'Master Service Agreement - TechCorp',
        parties: ['Company Inc.', 'TechCorp LLC'],
        expiryDate: '2024-12-15',
        status: 'Active',
        riskLevel: 'Low',
        uploadDate: '2024-01-15',
      },
      {
        id: '2',
        name: 'Software License Agreement - DataFlow',
        parties: ['Company Inc.', 'DataFlow Systems'],
        expiryDate: '2024-03-01',
        status: 'Renewal Due',
        riskLevel: 'Medium',
        uploadDate: '2023-12-01',
      },
      {
        id: '3',
        name: 'Consulting Agreement - Analytics Pro',
        parties: ['Company Inc.', 'Analytics Pro Ltd.'],
        expiryDate: '2024-08-30',
        status: 'Active',
        riskLevel: 'High',
        uploadDate: '2024-02-10',
      },
      {
        id: '4',
        name: 'NDA - Innovation Labs',
        parties: ['Company Inc.', 'Innovation Labs'],
        expiryDate: '2025-01-15',
        status: 'Active',
        riskLevel: 'Low',
        uploadDate: '2024-01-20',
      },
      {
        id: '5',
        name: 'Partnership Agreement - GlobalTech',
        parties: ['Company Inc.', 'GlobalTech Solutions'],
        expiryDate: '2023-12-31',
        status: 'Expired',
        riskLevel: 'High',
        uploadDate: '2023-06-15',
      },
      {
        id: '6',
        name: 'Equipment Lease - MachineWorks',
        parties: ['Company Inc.', 'MachineWorks Ltd.'],
        expiryDate: '2024-06-30',
        status: 'Active',
        riskLevel: 'Medium',
        uploadDate: '2023-12-20',
      },
    ];

    setTimeout(() => {
      setContracts(mockContracts);
      setFilteredContracts(mockContracts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter contracts based on search and filters
  useEffect(() => {
    let filtered = contracts.filter((contract) => {
      const matchesSearch =
        contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.parties.some((party) =>
          party.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesStatus = statusFilter === 'All' || contract.status === statusFilter;
      const matchesRisk = riskFilter === 'All' || contract.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });

    setFilteredContracts(filtered);
    setCurrentPage(1);
  }, [contracts, searchTerm, statusFilter, riskFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredContracts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContracts = filteredContracts.slice(startIndex, startIndex + itemsPerPage);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contracts</h1>
        <p className="text-gray-600">Manage and review your contract portfolio</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contracts or parties..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Renewal Due">Renewal Due</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="All">All Risk</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredContracts.length === 0 ? (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contracts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {contracts.length === 0
                ? "You haven't uploaded any contracts yet."
                : 'Try adjusting your search or filter criteria.'}
            </p>
            {contracts.length === 0 && (
              <div className="mt-6">
                <Link
                  to="/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Upload Contract
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contract Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Parties
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedContracts.map((contract) => (
                    <tr key={contract.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {contract.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Uploaded {new Date(contract.uploadDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {contract.parties.join(', ')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(contract.expiryDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            contract.status
                          )}`}
                        >
                          {contract.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(
                            contract.riskLevel
                          )}`}
                        >
                          {contract.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link
                          to={`/contracts/${contract.id}`}
                          className="inline-flex items-center px-3 py-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(startIndex + itemsPerPage, filteredContracts.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredContracts.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Contracts;