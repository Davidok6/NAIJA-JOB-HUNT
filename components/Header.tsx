import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-green-600 text-center">
          Naija Job Hunt
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Optimize Your Resume for the Nigerian Job Market
        </p>
      </div>
    </header>
  );
};