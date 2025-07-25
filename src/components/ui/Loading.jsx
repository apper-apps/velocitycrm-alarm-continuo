import React from "react";

const Loading = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="skeleton h-8 w-48 rounded-lg"></div>
        <div className="skeleton h-10 w-32 rounded-lg"></div>
      </div>
      
      {/* Search bar skeleton */}
      <div className="skeleton h-12 w-full max-w-md rounded-lg"></div>
      
      {/* Table skeleton */}
      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="grid grid-cols-4 gap-4">
            <div className="skeleton h-5 w-16 rounded"></div>
            <div className="skeleton h-5 w-20 rounded"></div>
            <div className="skeleton h-5 w-12 rounded"></div>
            <div className="skeleton h-5 w-14 rounded"></div>
          </div>
        </div>
        
        {/* Table rows */}
        {[...Array(8)].map((_, index) => (
          <div key={index} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
            <div className="grid grid-cols-4 gap-4 items-center">
              <div className="skeleton h-5 w-32 rounded"></div>
              <div className="skeleton h-5 w-28 rounded"></div>
              <div className="skeleton h-5 w-36 rounded"></div>
              <div className="skeleton h-5 w-28 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;