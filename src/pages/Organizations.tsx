import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Building2, Search, Eye, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import type { Organization } from '@/types';

const demoOrganizations: Organization[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    industry: 'Technology',
    contact_email: 'audit@acme.com',
    contact_phone: '+1 (555) 123-4567',
    address: '123 Tech Avenue, San Francisco, CA 94105',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'TechStart Inc.',
    industry: 'Software',
    contact_email: 'compliance@techstart.io',
    contact_phone: '+1 (555) 234-5678',
    address: '456 Innovation Blvd, Austin, TX 78701',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: '3',
    name: 'Global Finance Ltd',
    industry: 'Financial Services',
    contact_email: 'audit@globalfinance.com',
    contact_phone: '+1 (555) 345-6789',
    address: '789 Wall Street, New York, NY 10005',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '4',
    name: 'Retail Partners Co.',
    industry: 'Retail',
    contact_email: 'operations@retailpartners.com',
    contact_phone: '+1 (555) 456-7890',
    address: '321 Commerce Way, Chicago, IL 60601',
    created_at: '2024-04-05T00:00:00Z',
    updated_at: '2024-09-30T00:00:00Z',
  },
  {
    id: '5',
    name: 'Healthcare Plus',
    industry: 'Healthcare',
    contact_email: 'compliance@healthcareplus.org',
    contact_phone: '+1 (555) 567-8901',
    address: '555 Medical Center Dr, Boston, MA 02101',
    created_at: '2024-05-12T00:00:00Z',
    updated_at: '2024-08-25T00:00:00Z',
  },
];

export function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>(demoOrganizations);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    contact_email: '',
    contact_phone: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newOrg: Organization = {
      id: Date.now().toString(),
      name: formData.name,
      industry: formData.industry,
      contact_email: formData.contact_email,
      contact_phone: formData.contact_phone,
      address: formData.address,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setOrganizations([newOrg, ...organizations]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      industry: '',
      contact_email: '',
      contact_phone: '',
      address: '',
    });
  };

  const filteredOrganizations = organizations.filter((org) =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.industry?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Header
        title="Organizations"
        subtitle="Manage client organizations"
        showAddButton
        addButtonLabel="New Organization"
        onAddClick={() => setShowModal(true)}
      />

      <div className="pt-20 p-6 space-y-6">
        {/* Search */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Organizations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrganizations.map((org) => (
            <Card key={org.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-indigo-100">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-1">{org.name}</h3>
              {org.industry && (
                <p className="text-sm text-indigo-600 font-medium mb-4">{org.industry}</p>
              )}

              <div className="space-y-2 text-sm">
                {org.contact_email && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{org.contact_email}</span>
                  </div>
                )}
                {org.contact_phone && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{org.contact_phone}</span>
                  </div>
                )}
                {org.address && (
                  <div className="flex items-start gap-2 text-slate-600">
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                    <span className="line-clamp-2">{org.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Active Audits</span>
                  <span className="font-medium text-slate-700">3</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Create Organization Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add New Organization"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Organization Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter organization name"
            required
          />

          <Input
            label="Industry"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare, Finance"
          />

          <Input
            label="Contact Email"
            type="email"
            value={formData.contact_email}
            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            placeholder="audit@company.com"
          />

          <Input
            label="Contact Phone"
            value={formData.contact_phone}
            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
          />

          <Textarea
            label="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Enter full address"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Organization</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
