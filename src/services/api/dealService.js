import dealsData from "@/services/mockData/deals.json";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.deals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const deal = this.deals.find(deal => deal.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.deals.map(d => d.Id), 0) + 1;
    const now = new Date().toISOString();
    
    const newDeal = {
      Id: newId,
      ...dealData,
      createdAt: now,
      updatedAt: now
    };
    
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const dealIndex = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (dealIndex === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...this.deals[dealIndex],
      ...dealData,
      updatedAt: new Date().toISOString()
    };
    
    this.deals[dealIndex] = updatedDeal;
    return { ...updatedDeal };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const dealIndex = this.deals.findIndex(deal => deal.Id === parseInt(id));
    if (dealIndex === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(dealIndex, 1);
    return true;
  }
}

export const dealService = new DealService();