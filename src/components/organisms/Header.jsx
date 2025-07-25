import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ onMenuClick }) => {
  return (
    <div className="lg:pl-60">
      <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white border-b border-gray-200">
        <button
          type="button"
          className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary lg:hidden"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <ApperIcon name="Menu" className="h-6 w-6" />
        </button>
        
        <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Relationship Management
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                Admin User
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;