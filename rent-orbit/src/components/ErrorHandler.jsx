import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, WifiOff, Server, Frown, Loader } from 'lucide-react';

const ErrorHandler = ({ error, onRetry }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Determine error type
  const getErrorDetails = () => {
    if (!error) return { icon: <AlertCircle size={48} />, message: 'Something went wrong' };

    const errorMessage = error.message || '';
    
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      return {
        icon: <WifiOff size={48} />,
        message: 'Network connection error',
        description: 'Please check your internet connection and try again.'
      };
    }

    if (error.response) {
      switch (error.response.status) {
        case 404:
          return {
            icon: <Server size={48} />,
            message: 'Resource not found',
            description: 'The requested data could not be found on the server.'
          };
        case 500:
          return {
            icon: <Server size={48} />,
            message: 'Server error',
            description: 'Our servers are experiencing issues. Please try again later.'
          };
        case 503:
          return {
            icon: <Server size={48} />,
            message: 'Service unavailable',
            description: 'We\'re undergoing maintenance. Please check back soon.'
          };
        default:
          return {
            icon: <AlertCircle size={48} />,
            message: 'Server error',
            description: `Error code: ${error.response.status}`
          };
      }
    }

    return {
      icon: <Frown size={48} />,
      message: 'Something went wrong',
      description: 'We encountered an unexpected error. Please try again.'
    };
  };

  const { icon, message, description } = getErrorDetails();

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[300px] p-6 text-center bg-white h-screen transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="mb-6 animate-bounce">
        {icon}
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{message}</h2>
      {description && (
        <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      )}
      
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className={`flex items-center justify-center px-4 py-2 bg-gradient-to-r from-orange-600 to-purple-600 text-white font-medium rounded-lg transition-colors duration-300 ${
            isRetrying ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {isRetrying ? (
            <>
              <Loader className="animate-spin mr-2" size={20} />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2" size={20} />
              Try Again
            </>
          )}
        </button>
      )}
      
      <div className="mt-8 text-sm text-gray-500">
        Need help? <a href="/contact" className="text-blue-600 hover:underline">Contact support</a>
      </div>
    </div>
  );
};

export default ErrorHandler;