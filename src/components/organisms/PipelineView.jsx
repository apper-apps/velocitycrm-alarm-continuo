import React, { useState } from 'react';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const stages = [
  { key: 'Discovery', label: 'Discovery', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { key: 'Qualified', label: 'Qualified', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { key: 'Proposal', label: 'Proposal', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { key: 'Negotiation', label: 'Negotiation', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { key: 'Closed Won', label: 'Closed Won', color: 'bg-green-100 text-green-800 border-green-200' },
  { key: 'Closed Lost', label: 'Closed Lost', color: 'bg-red-100 text-red-800 border-red-200' }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value);
}

function DealCard({ deal, onEdit, onDelete, onDragStart, onDragEnd }) {
  const stage = stages.find(s => s.key === deal.stage);
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, deal)}
      onDragEnd={onDragEnd}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-move deal-card"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{deal.name}</h3>
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(deal);
            }}
            className="p-1 h-6 w-6 text-gray-400 hover:text-blue-600"
          >
            <ApperIcon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(deal.Id);
            }}
            className="p-1 h-6 w-6 text-gray-400 hover:text-red-600"
          >
            <ApperIcon name="Trash2" size={12} />
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <ApperIcon name="User" size={14} className="text-gray-400" />
          <span>{deal.contactName}</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Building" size={14} className="text-gray-400" />
          <span>{deal.company}</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="DollarSign" size={14} className="text-gray-400" />
          <span className="font-semibold text-gray-900">{formatCurrency(deal.value)}</span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Calendar" size={14} className="text-gray-400" />
          <span>{format(new Date(deal.expectedCloseDate), 'MMM dd, yyyy')}</span>
        </div>
        {deal.probability && (
          <div className="flex items-center gap-2">
            <ApperIcon name="Target" size={14} className="text-gray-400" />
            <span>{deal.probability}% probability</span>
          </div>
        )}
      </div>
    </div>
  );
}

function StageColumn({ stage, deals, onEdit, onDelete, onDragStart, onDragEnd, onDragOver, onDrop, dragOverStage }) {
  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const isDragOver = dragOverStage === stage.key;

  return (
    <div 
      className={`bg-gray-50 rounded-lg p-4 min-h-[600px] transition-colors ${
        isDragOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'border border-gray-200'
      }`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage.key)}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">{stage.label}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
            {deals.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-sm text-gray-600 font-medium">
            {formatCurrency(totalValue)}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {deals.map((deal) => (
          <DealCard
            key={deal.Id}
            deal={deal}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

export default function PipelineView({ deals, onEdit, onDelete, onStageUpdate }) {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  function handleDragStart(e, deal) {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
    e.target.classList.add('deal-dragging');
  }

  function handleDragEnd(e) {
    e.target.classList.remove('deal-dragging');
    setDraggedDeal(null);
    setDragOverStage(null);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, targetStage) {
    e.preventDefault();
    setDragOverStage(null);
    
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onStageUpdate(draggedDeal.Id, targetStage);
    }
  }

  function handleDragEnter(e, stageKey) {
    e.preventDefault();
    setDragOverStage(stageKey);
  }

  function handleDragLeave(e) {
    // Only clear drag over state if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null);
    }
  }

  return (
    <div className="pipeline-view">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-[600px]">
        {stages.map((stage) => {
          const stageDeals = deals.filter(deal => deal.stage === stage.key);
          
          return (
            <StageColumn
              key={stage.key}
              stage={stage}
              deals={stageDeals}
              onEdit={onEdit}
              onDelete={onDelete}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => {
                handleDragOver(e);
                handleDragEnter(e, stage.key);
              }}
              onDrop={handleDrop}
              dragOverStage={dragOverStage}
            />
          );
        })}
      </div>
    </div>
  );
}