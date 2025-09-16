import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../components/LoadingSpinner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      status: 'uploading',
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate file upload and processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id);
    });
  };

  const simulateFileProcessing = (fileId: string) => {
    let progress = 0;

    // Upload simulation
    const uploadInterval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadInterval);
        
        // Start processing
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: 'processing', progress: 0 } : f
          )
        );

        // Processing simulation
        let processingProgress = 0;
        const processInterval = setInterval(() => {
          processingProgress += Math.random() * 15;
          if (processingProgress >= 100) {
            processingProgress = 100;
            clearInterval(processInterval);
            
            // Complete
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, status: 'completed', progress: 100 } : f
              )
            );
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileId ? { ...f, progress: processingProgress } : f
              )
            );
          }
        }, 500);
      } else {
        setFiles((prev) =>
          prev.map((f) => (f.id === fileId ? { ...f, progress } : f))
        );
      }
    }, 300);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <LoadingSpinner size="sm" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing with LlamaCloud...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Upload Contracts</h1>
        <p className="text-gray-600">Upload PDF, TXT, or DOCX files for analysis</p>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-lg text-blue-600">Drop the files here...</p>
        ) : (
          <div>
            <p className="text-lg text-gray-600 mb-2">
              Drag and drop your contract files here, or click to select files
            </p>
            <p className="text-sm text-gray-500">
              Supports PDF, TXT, and DOCX files up to 10MB each
            </p>
          </div>
        )}
        <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
          Select Files
        </button>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Progress</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {files.map((file) => (
              <div key={file.id} className="px-6 py-4 border-b border-gray-200 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <span className="text-sm text-gray-600">{getStatusText(file.status)}</span>
                  </div>
                </div>
                
                {/* Progress Bar */}
                {(file.status === 'uploading' || file.status === 'processing') && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}

                {/* Processing Steps */}
                {file.status === 'processing' && (
                  <div className="mt-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>✓ File uploaded successfully</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Parsing document with LlamaCloud...</span>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Generating embeddings...</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Saving to database...</span>
                    </div>
                  </div>
                )}

                {/* Completion Message */}
                {file.status === 'completed' && (
                  <div className="mt-3 p-3 bg-green-50 rounded-md">
                    <div className="flex">
                      <CheckCircleIcon className="h-5 w-5 text-green-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Contract processed successfully!
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            Document has been parsed, chunked, and stored with embeddings. 
                            You can now query this contract using natural language.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {file.status === 'error' && (
                  <div className="mt-3 p-3 bg-red-50 rounded-md">
                    <div className="flex">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">
                          Upload failed
                        </h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>{file.error || 'An error occurred while processing the file.'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">How it works</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
              1
            </span>
            <span>Upload your contract files (PDF, TXT, or DOCX)</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
              2
            </span>
            <span>Our system parses and chunks the document using LlamaCloud</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
              3
            </span>
            <span>Embeddings are generated and stored in our vector database</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center text-xs font-medium">
              4
            </span>
            <span>Query your contracts using natural language in the Query section</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;