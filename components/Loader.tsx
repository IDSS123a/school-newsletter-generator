
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-10">
    <div className="w-12 h-12 border-4 border-t-transparent border-[#004080] rounded-full animate-spin"></div>
    <p className="mt-4 text-gray-600">Generating your newsletter...</p>
    <p className="mt-1 text-sm text-gray-500">This may take a moment.</p>
  </div>
);
