import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DealList from "@/components/organisms/DealList";
import DealForm from "@/components/organisms/DealForm";
import PipelineView from "@/components/organisms/PipelineView";
import { dealService } from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const DealsPage = () => {
const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" or "pipeline"
  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      setLoading(true);
      setError(null);
      const data = await dealService.getAll();
      setDeals(data);
    } catch (err) {
      console.error("Error loading deals:", err);
      setError("Failed to load deals. Please try again.");
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    setSearchQuery(e.target.value);
  }

  function handleAddDeal() {
    setEditingDeal(null);
    setShowForm(true);
  }

  function handleEditDeal(deal) {
    setEditingDeal(deal);
    setShowForm(true);
  }

  async function handleSaveDeal(formData) {
    try {
      setIsFormLoading(true);
      
      if (editingDeal) {
        const updatedDeal = await dealService.update(editingDeal.Id, formData);
        setDeals(prev => prev.map(deal => 
          deal.Id === editingDeal.Id ? updatedDeal : deal
        ));
        toast.success("Deal updated successfully!");
      } else {
        const newDeal = await dealService.create(formData);
        setDeals(prev => [newDeal, ...prev]);
        toast.success("Deal created successfully!");
      }
      
      handleCloseForm();
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error("Failed to save deal");
      throw error;
    } finally {
      setIsFormLoading(false);
    }
  }

  async function handleDeleteDeal(dealId) {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(deal => deal.Id !== dealId));
      toast.success("Deal deleted successfully!");
    } catch (error) {
      console.error("Error deleting deal:", error);
      toast.error("Failed to delete deal");
    }
  }

function handleCloseForm() {
    setShowForm(false);
    setEditingDeal(null);
    setIsFormLoading(false);
  }

  // Handle stage update from pipeline drag and drop
  async function handleStageUpdate(dealId, newStage) {
    try {
      const updatedDeal = await dealService.update(dealId, { stage: newStage });
      setDeals(prevDeals => 
        prevDeals.map(deal => 
          deal.Id === dealId ? updatedDeal : deal
        )
      );
      toast.success(`Deal moved to ${newStage}`);
    } catch (error) {
      console.error("Failed to update deal stage:", error);
      toast.error("Failed to update deal stage");
    }
  }

  // Filter deals based on search query
  const filteredDeals = deals.filter(deal =>
    deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.stage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <Loading message="Loading deals..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDeals} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
        <p className="text-gray-600">Manage your sales opportunities and revenue pipeline</p>
      </div>

<div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search deals, contacts, companies, or stages..."
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ApperIcon name="List" className="w-4 h-4 mr-2 inline" />
              List
            </button>
            <button
              onClick={() => setViewMode("pipeline")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === "pipeline"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <ApperIcon name="Columns" className="w-4 h-4 mr-2 inline" />
              Pipeline
            </button>
          </div>
          <Button onClick={handleAddDeal} className="button-shadow hover-lift">
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </div>

{filteredDeals.length === 0 ? (
        searchQuery ? (
          <Empty
            icon="Search"
            title="No deals found"
            description={`No deals match "${searchQuery}". Try adjusting your search.`}
          />
        ) : (
          <Empty
            icon="DollarSign"
            title="No deals yet"
            description="Start building your sales pipeline by creating your first deal."
            actionLabel="Add Deal"
            onAction={handleAddDeal}
          />
        )
      ) : viewMode === "list" ? (
        <DealList
          deals={filteredDeals}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
        />
      ) : (
        <PipelineView
          deals={filteredDeals}
          onEdit={handleEditDeal}
          onDelete={handleDeleteDeal}
          onStageUpdate={handleStageUpdate}
        />
      )}

      {searchQuery && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {filteredDeals.length} of {deals.length} deals
        </div>
      )}

      {showForm && (
        <DealForm
          deal={editingDeal}
          onSave={handleSaveDeal}
          onCancel={handleCloseForm}
          isLoading={isFormLoading}
        />
      )}
    </div>
  );
};

export default DealsPage;