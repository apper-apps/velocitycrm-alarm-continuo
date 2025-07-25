import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { leadService } from "@/services/api/leadService";
import { dealService } from "@/services/api/dealService";
import ApperIcon from "@/components/ApperIcon";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";

const LeadsPage = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
source: 'Website',
    status: 'New',
    companySize: 'Small (1-10)',
    budget: 'Under $10K',
    urgency: 'Low',
    notes: ''
  });

  const statuses = ['All', 'New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Converted', 'Lost'];
  const sources = ['All', 'Website', 'Referral', 'Cold Call', 'Email Campaign', 'Social Media', 'Trade Show'];
  const companySizes = ['Small (1-10)', 'Medium (11-100)', 'Large (101-1000)', 'Enterprise (1000+)'];
  const budgets = ['Under $10K', '$10K - $50K', '$50K - $100K', '$100K - $500K', 'Over $500K'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Urgent'];

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await leadService.getAll();
      setLeads(data);
    } catch (err) {
      setError('Failed to load leads');
      toast.error('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLead = () => {
    setEditingLead(null);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      source: 'Website',
      status: 'New',
      companySize: 'Small (1-10)',
      budget: 'Under $10K',
      urgency: 'Low',
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setFormData({ ...lead });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingLead) {
        const updatedLead = await leadService.update(editingLead.Id, formData);
        setLeads(leads.map(lead => lead.Id === editingLead.Id ? updatedLead : lead));
        toast.success('Lead updated successfully');
      } else {
        const newLead = await leadService.create(formData);
        setLeads([newLead, ...leads]);
        toast.success('Lead created successfully');
      }
      setShowForm(false);
    } catch (err) {
      toast.error(editingLead ? 'Failed to update lead' : 'Failed to create lead');
    }
  };

  const handleDeleteLead = async (leadId) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;

    try {
      await leadService.delete(leadId);
      setLeads(leads.filter(lead => lead.Id !== leadId));
      toast.success('Lead deleted successfully');
    } catch (err) {
      toast.error('Failed to delete lead');
    }
  };

const handleStatusChange = async (leadId, newStatus) => {
    try {
      const updatedLead = await leadService.update(leadId, { status: newStatus });
      setLeads(leads.map(lead => lead.Id === leadId ? updatedLead : lead));
      
      // Check if status qualifies for deal creation
      const qualifyingStatuses = ['Qualified', 'Proposal', 'Negotiation', 'Lost'];
      if (qualifyingStatuses.includes(newStatus)) {
        // Map lead status to deal stage
        const statusToStageMap = {
          'Qualified': 'Qualified',
          'Proposal': 'Proposal', 
          'Negotiation': 'Negotiation',
          'Lost': 'Closed Lost'
        };
        
        // Create deal from lead data
        const dealData = {
          name: updatedLead.company, // Deal name -> company
          contactName: updatedLead.firstName, // Contact name -> first name
          company: updatedLead.company, // Company -> company
          stage: statusToStageMap[newStatus], // Stage -> status mapping
          contactId: updatedLead.Id, // Use lead ID as temporary contact reference
          value: 0, // Default value
          probability: newStatus === 'Lost' ? 0 : 50, // 0% for lost, 50% default for others
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
          description: `Deal created from lead: ${updatedLead.firstName} ${updatedLead.lastName} - ${updatedLead.notes || 'No additional notes'}`
        };
        
        await dealService.create(dealData);
        toast.success(`Lead updated and deal created for ${updatedLead.company}`);
      } else {
        toast.success('Lead status updated');
      }
    } catch (err) {
      toast.error('Failed to update lead status');
    }
  };

  const getQualificationStatus = (score) => {
    if (score >= 80) return { label: 'Hot', color: 'bg-red-100 text-red-800' };
    if (score >= 60) return { label: 'Warm', color: 'bg-orange-100 text-orange-800' };
    if (score >= 40) return { label: 'Cold', color: 'bg-blue-100 text-blue-800' };
    return { label: 'Unqualified', color: 'bg-gray-100 text-gray-800' };
  };

const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-green-100 text-green-800',
      'Proposal': 'bg-orange-100 text-orange-800',
      'Negotiation': 'bg-indigo-100 text-indigo-800',
      'Converted': 'bg-purple-100 text-purple-800',
      'Lost': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAndSortedLeads = leads
    .filter(lead => {
      const matchesSearch = `${lead.firstName} ${lead.lastName} ${lead.company} ${lead.email}`
        .toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'All' || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    })
    .sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'name') {
        aVal = `${a.firstName} ${a.lastName}`;
        bVal = `${b.firstName} ${b.lastName}`;
      }
      
      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
            <p className="text-gray-600">Capture and manage potential customers with lead scoring</p>
          </div>
          <Button onClick={handleCreateLead} className="flex items-center gap-2">
            <ApperIcon name="UserPlus" size={16} />
            Add Lead
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
              </div>
              <ApperIcon name="Users" size={24} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot Leads</p>
                <p className="text-2xl font-bold text-red-600">
                  {leads.filter(lead => lead.score >= 80).length}
                </p>
              </div>
              <ApperIcon name="TrendingUp" size={24} className="text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Qualified</p>
                <p className="text-2xl font-bold text-green-600">
                  {leads.filter(lead => lead.status === 'Qualified').length}
                </p>
              </div>
              <ApperIcon name="CheckCircle" size={24} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Score</p>
                <p className="text-2xl font-bold text-blue-600">
                  {leads.length > 0 ? Math.round(leads.reduce((sum, lead) => sum + lead.score, 0) / leads.length) : 0}
                </p>
              </div>
              <ApperIcon name="Target" size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Source</Label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Sort By</Label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="score">Score</option>
                <option value="name">Name</option>
                <option value="company">Company</option>
                <option value="createdAt">Created Date</option>
              </select>
            </div>
            <div>
              <Label>Order</Label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedLeads.map(lead => {
          const qualification = getQualificationStatus(lead.score);
          return (
            <div key={lead.Id} className="bg-white rounded-lg border p-6 hover-lift">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lead.firstName} {lead.lastName}
                  </h3>
                  <p className="text-gray-600">{lead.position} at {lead.company}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditLead(lead)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ApperIcon name="Edit2" size={16} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => handleDeleteLead(lead.Id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <ApperIcon name="Trash2" size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <ApperIcon name="Mail" size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{lead.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Phone" size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{lead.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="MapPin" size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{lead.source}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${qualification.color}`}>
                    {qualification.label}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="Target" size={14} className="text-blue-500" />
                  <span className="text-sm font-medium text-blue-600">{lead.score}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Lead Score</span>
                  <span>{lead.score}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      lead.score >= 80 ? 'bg-red-500' :
                      lead.score >= 60 ? 'bg-orange-500' :
                      lead.score >= 40 ? 'bg-blue-500' : 'bg-gray-400'
                    }`}
                    style={{ width: `${lead.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{lead.notes}</p>
              </div>

              <div className="flex gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => handleStatusChange(lead.Id, e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded px-2 py-1"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditLead(lead)}
                  className="px-3"
                >
                  View
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredAndSortedLeads.length === 0 && (
        <div className="text-center py-12">
          <ApperIcon name="Users" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'All' || sourceFilter !== 'All'
              ? 'Try adjusting your filters'
              : 'Start by adding your first lead'}
          </p>
          <Button onClick={handleCreateLead}>Add Lead</Button>
        </div>
      )}

      {/* Lead Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingLead ? 'Edit Lead' : 'Add New Lead'}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Last Name *</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company</Label>
                    <Input
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Position</Label>
                    <Input
                      value={formData.position}
                      onChange={(e) => setFormData({...formData, position: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Source</Label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData({...formData, source: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sources.filter(s => s !== 'All').map(source => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statuses.filter(s => s !== 'All').map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Company Size</Label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => setFormData({...formData, companySize: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {companySizes.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Budget</Label>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {budgets.map(budget => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Urgency</Label>
                  <select
                    value={formData.urgency}
                    onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {urgencyLevels.map(urgency => (
                      <option key={urgency} value={urgency}>{urgency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label>Notes</Label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Additional notes about this lead..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingLead ? 'Update Lead' : 'Create Lead'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;