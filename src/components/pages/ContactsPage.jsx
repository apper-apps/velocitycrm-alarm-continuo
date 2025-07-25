import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import ContactList from "@/components/organisms/ContactList";
import ContactForm from "@/components/organisms/ContactForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Error loading contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [contacts, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleSaveContact = async (formData) => {
    try {
      if (editingContact) {
        const updatedContact = await contactService.update(editingContact.Id, formData);
        setContacts(prev => prev.map(contact => 
          contact.Id === editingContact.Id ? updatedContact : contact
        ));
      } else {
        const newContact = await contactService.create(formData);
        setContacts(prev => [newContact, ...prev]);
      }
    } catch (err) {
      console.error("Error saving contact:", err);
      throw err;
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      toast.success("Contact deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete contact. Please try again.");
      console.error("Error deleting contact:", err);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600">Manage your customer relationships and contact information</p>
        </div>
        <Button onClick={handleAddContact}>
          <ApperIcon name="Plus" className="w-4 h-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SearchBar
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search contacts by name, company, or email..."
        />
        <div className="text-sm text-gray-600">
          {filteredContacts.length} of {contacts.length} contacts
        </div>
      </div>

      {/* Content */}
      {filteredContacts.length === 0 ? (
        searchTerm ? (
          <div className="text-center py-12">
            <ApperIcon name="Search" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contacts found</h3>
            <p className="text-gray-600">
              No contacts match your search for "{searchTerm}". Try adjusting your search terms.
            </p>
          </div>
        ) : (
          <Empty
            icon="Users"
            title="No contacts yet"
            description="Get started by adding your first contact to begin managing your customer relationships."
            actionLabel="Add Contact"
            onAction={handleAddContact}
          />
        )
      ) : (
        <ContactList
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
        />
      )}

      {/* Contact Form Modal */}
      <ContactForm
        contact={editingContact}
        onSave={handleSaveContact}
        onCancel={handleCloseForm}
        isOpen={showForm}
      />
    </div>
  );
};

export default ContactsPage;