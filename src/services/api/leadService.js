import leadsData from '@/services/mockData/leads.json';

class LeadService {
  constructor() {
    this.leads = [...leadsData];
    this.nextId = Math.max(...this.leads.map(lead => lead.Id), 0) + 1;
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.leads]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const lead = this.leads.find(l => l.Id === parseInt(id));
        if (lead) {
          resolve({ ...lead });
        } else {
          reject(new Error('Lead not found'));
        }
      }, 200);
    });
  }

  async create(leadData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newLead = {
          ...leadData,
          Id: this.nextId++,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score: this.calculateLeadScore(leadData)
        };
        this.leads.unshift(newLead);
        resolve({ ...newLead });
      }, 400);
    });
  }

  async update(id, leadData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.leads.findIndex(l => l.Id === parseInt(id));
        if (index !== -1) {
          const updatedLead = {
            ...this.leads[index],
            ...leadData,
            Id: parseInt(id),
            updatedAt: new Date().toISOString(),
            score: this.calculateLeadScore({ ...this.leads[index], ...leadData })
          };
          this.leads[index] = updatedLead;
          resolve({ ...updatedLead });
        } else {
          reject(new Error('Lead not found'));
        }
      }, 400);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.leads.findIndex(l => l.Id === parseInt(id));
        if (index !== -1) {
          const deletedLead = this.leads.splice(index, 1)[0];
          resolve({ ...deletedLead });
        } else {
          reject(new Error('Lead not found'));
        }
      }, 300);
    });
  }

  calculateLeadScore(lead) {
    let score = 0;
    
    // Company size scoring
    const companySizeScores = {
      'Small (1-10)': 20,
      'Medium (11-100)': 40,
      'Large (101-1000)': 60,
      'Enterprise (1000+)': 80
    };
    score += companySizeScores[lead.companySize] || 0;

    // Budget scoring
    const budgetScores = {
      'Under $10K': 10,
      '$10K - $50K': 30,
      '$50K - $100K': 50,
      '$100K - $500K': 70,
      'Over $500K': 90
    };
    score += budgetScores[lead.budget] || 0;

    // Urgency scoring
    const urgencyScores = {
      'Low': 10,
      'Medium': 30,
      'High': 50,
      'Urgent': 70
    };
    score += urgencyScores[lead.urgency] || 0;

    // Source scoring
    const sourceScores = {
      'Website': 40,
      'Referral': 60,
      'Cold Call': 20,
      'Email Campaign': 30,
      'Social Media': 35,
      'Trade Show': 50
    };
    score += sourceScores[lead.source] || 0;

    return Math.min(score, 100);
  }

  getQualificationStatus(score) {
    if (score >= 80) return 'Hot';
    if (score >= 60) return 'Warm';
    if (score >= 40) return 'Cold';
    return 'Unqualified';
  }
}

export const leadService = new LeadService();