import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const contact = this.contacts.find(contact => contact.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = Math.max(...this.contacts.map(c => c.Id), 0) + 1;
    const now = new Date().toISOString();
    
    const newContact = {
      Id: newId,
      ...contactData,
      createdAt: now,
      updatedAt: now
    };
    
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const contactIndex = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (contactIndex === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...this.contacts[contactIndex],
      ...contactData,
      updatedAt: new Date().toISOString()
    };
    
    this.contacts[contactIndex] = updatedContact;
    return { ...updatedContact };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const contactIndex = this.contacts.findIndex(contact => contact.Id === parseInt(id));
    if (contactIndex === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(contactIndex, 1);
    return true;
  }
}

export const contactService = new ContactService();