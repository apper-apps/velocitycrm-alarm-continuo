import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const LeadsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600">Track and manage your sales leads through the pipeline</p>
      </div>
      
      <Empty
        icon="UserPlus"
        title="Leads Management Coming Soon"
        description="Track potential customers and manage your sales pipeline with advanced lead scoring and conversion tracking."
        actionLabel="Learn More"
      />
    </div>
  );
};

export default LeadsPage;