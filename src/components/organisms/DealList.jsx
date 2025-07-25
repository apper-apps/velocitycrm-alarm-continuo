import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const DealList = ({ deals, onEdit, onDelete }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageColor = (stage) => {
    const colors = {
      'Discovery': 'bg-blue-100 text-blue-800',
      'Qualified': 'bg-yellow-100 text-yellow-800',
      'Proposal': 'bg-purple-100 text-purple-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Closed Won': 'bg-green-100 text-green-800',
      'Closed Lost': 'bg-red-100 text-red-800',
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-xl card-shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="gradient-header text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                Deal Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                Contact/Company
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                Close Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                Stage
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deals.map((deal) => (
              <tr key={deal.Id} className="table-row transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <ApperIcon name="DollarSign" className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {deal.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {deal.probability}% probability
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {deal.contactName}
                  </div>
                  <div className="text-sm text-gray-500">
                    {deal.company}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-green-600">
                    {formatCurrency(deal.value)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {format(new Date(deal.expectedCloseDate), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(deal.stage)}`}>
                    {deal.stage}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onEdit(deal)}
                      className="text-primary hover:text-accent"
                    >
                      <ApperIcon name="Edit2" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => onDelete(deal.Id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DealList;