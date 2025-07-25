import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const ActivitiesPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Activities</h1>
        <p className="text-gray-600">Track interactions and schedule follow-ups with your contacts</p>
      </div>
      
      <Empty
        icon="Calendar"
        title="Activity Tracking Coming Soon"
        description="Log calls, meetings, emails, and tasks. Set reminders and track your team's engagement with leads and customers."
        actionLabel="Learn More"
      />
    </div>
  );
};

export default ActivitiesPage;