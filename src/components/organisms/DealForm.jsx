import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const DealForm = ({ deal, onSave, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    company: "",
    value: "",
    expectedCloseDate: "",
    stage: "Discovery",
    probability: "50",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const stages = [
    "Discovery",
    "Qualified", 
    "Proposal",
    "Negotiation",
    "Closed Won",
    "Closed Lost"
  ];

  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || "",
        contactName: deal.contactName || "",
        company: deal.company || "",
        value: deal.value?.toString() || "",
        expectedCloseDate: deal.expectedCloseDate || "",
        stage: deal.stage || "Discovery",
        probability: deal.probability?.toString() || "50",
        description: deal.description || "",
      });
    }
  }, [deal]);

  function validateForm() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Deal name is required";
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    if (!formData.value || parseFloat(formData.value) <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }

    if (!formData.expectedCloseDate) {
      newErrors.expectedCloseDate = "Expected close date is required";
    } else {
      const closeDate = new Date(formData.expectedCloseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (closeDate < today) {
        newErrors.expectedCloseDate = "Close date cannot be in the past";
      }
    }

    if (!formData.probability || parseInt(formData.probability) < 0 || parseInt(formData.probability) > 100) {
      newErrors.probability = "Probability must be between 0 and 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
      };

      await onSave(dealData);
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error("Failed to save deal");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl card-shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="gradient-header text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ApperIcon name="DollarSign" className="w-6 h-6" />
              <h2 className="text-xl font-semibold">
                {deal ? "Edit Deal" : "Add New Deal"}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="small"
              onClick={onCancel}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Deal Name"
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter deal name"
              error={errors.name}
              required
            />

            <FormField
              label="Contact Name"
              id="contactName"
              type="text"
              value={formData.contactName}
              onChange={handleChange}
              placeholder="Enter contact name"
              error={errors.contactName}
              required
            />

            <FormField
              label="Company"
              id="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              placeholder="Enter company name"
              error={errors.company}
              required
            />

            <FormField
              label="Deal Value ($)"
              id="value"
              type="number"
              value={formData.value}
              onChange={handleChange}
              placeholder="0"
              error={errors.value}
              required
            />

            <FormField
              label="Expected Close Date"
              id="expectedCloseDate"
              type="date"
              value={formData.expectedCloseDate}
              onChange={handleChange}
              error={errors.expectedCloseDate}
              required
            />

            <div className="space-y-2">
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
                Stage *
              </label>
              <select
                id="stage"
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary form-input"
                required
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            <FormField
              label="Probability (%)"
              id="probability"
              type="number"
              min="0"
              max="100"
              value={formData.probability}
              onChange={handleChange}
              placeholder="50"
              error={errors.probability}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter deal description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none form-input"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                  {deal ? "Update Deal" : "Create Deal"}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;