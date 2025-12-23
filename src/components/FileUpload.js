import React, { useRef, useState } from 'react';
import { extractTextFromFile } from '../utils/fileParser';

const FileUpload = ({ onFileProcessed, isProcessing }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (file) => {
    setError(null);
    
    // Validate file type
    const fileName = file.name.toLowerCase();
    const validTypes = ['.pdf', '.docx', '.txt'];
    const isValidType = validTypes.some(type => fileName.endsWith(type));
    
    if (!isValidType) {
      setError('Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size exceeds 10MB. Please upload a smaller file.');
      return;
    }

    try {
      const text = await extractTextFromFile(file);
      if (text.trim().length < 100) {
        setError('The file does not contain enough text. Please upload a document with more content.');
        return;
      }
      onFileProcessed({ file, text, fileName: file.name });
    } catch (err) {
      setError(err.message || 'Failed to process file. Please try again.');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          dragActive
            ? 'border-rose-500 bg-gradient-to-br from-purple-50 to-rose-50 dark:from-purple-900/20 dark:to-rose-900/20 shadow-xl scale-105'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 hover:border-rose-400 dark:hover:border-rose-500'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={!isProcessing ? onButtonClick : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
          className="hidden"
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className={`relative ${isProcessing ? 'animate-pulse' : ''}`}>
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            {dragActive && (
              <div className="absolute -inset-2 bg-rose-200 dark:bg-rose-800 rounded-2xl opacity-50 animate-ping"></div>
            )}
          </div>
          
          <div>
            <p className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {isProcessing ? 'Processing file...' : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              or click to browse files from your device
            </p>
            <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-400 dark:text-gray-500">
              <span className="flex items-center space-x-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>PDF, DOCX, TXT</span>
              </span>
              <span>•</span>
              <span>Max 10MB</span>
            </div>
          </div>
          
          {!isProcessing && (
            <button
              type="button"
              className="mt-4 px-8 py-3 bg-gradient-to-r from-purple-600 to-rose-500 hover:from-purple-700 hover:to-rose-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
            >
              Choose File
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-400 rounded-r-xl shadow-md">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
