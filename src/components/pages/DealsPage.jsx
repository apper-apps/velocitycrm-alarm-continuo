import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const DealsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <p className="text-gray-600">Manage your sales opportunities and revenue pipeline</p>
      </div>
      
      <Empty
        icon="DollarSign"
        title="Deal Management Coming Soon"
        description="Track deals through your sales process with customizable stages, revenue forecasting, and win/loss analysis."
        actionLabel="Learn More"
      />
    </div>
  );
};

export default DealsPage;