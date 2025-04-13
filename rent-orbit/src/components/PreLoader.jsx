import { useState, useEffect } from 'react';

const PreLoader = () => {
  const [activeDot, setActiveDot] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 5);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <div className="relative w-24 h-24 mb-8">
        {/* Main orb with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-orange-600 shadow-lg animate-pulse"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 opacity-70 animate-ping"></div>
        
        {/* Inner circle */}
        <div className="absolute inset-4 rounded-full bg-white bg-opacity-30 backdrop-blur-sm"></div>
      </div>
      
      <div className="flex space-x-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === activeDot
                ? 'bg-gradient-to-br from-purple-600 to-orange-600 transform scale-125'
                : 'bg-gradient-to-br from-purple-300 to-orange-300'
            }`}
          ></div>
        ))}
      </div>
      
      <p className="mt-6 text-lg font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-500">
        Loading...
      </p>
    </div>
  );
};

export default PreLoader;