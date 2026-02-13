import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Search, Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Control, ControlCategory, ControlType, ControlFrequency, ControlEffectiveness } from '@/types';

const categoryOptions = [
  { value: 'preventive', label: 'Preventive' },
  { value: 'detective', label: 'Detective' },
  { value: 'corrective', label: 'Corrective' },
  { value: 'directive', label: 'Directive' },
];

const typeOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'automated', label: 'Automated' },
  { value: 'it_dependent', label: 'IT Dependent' },
];

const frequencyOptions = [
  { value: 'continuous', label: 'Continuous' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annually', label: 'Annually' },
];

const effectivenessOptions = [
  { value: 'not_tested', label: 'Not Tested' },
  { value: 'effective', label: 'Effective' },
  { value: 'partially_effective', label: 'Partially Effective' },
  { value: 'ineffective', label: 'Ineffective' },
];

const demoControls: Control[] = [
  {
    id: '1',
    control_id: 'CTL-001',
    title: 'Segregation of Duties - Payments',
    description: 'Separate authorization, processing, and review functions for payment transactions',
    category: 'preventive',
    control_type: 'manual',
    frequency: 'continuous',
    owner_id: '1',
    effectiveness: 'effective',
    last_tested: '2024-11-15',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: '2',
    control_id: 'CTL-002',
    title: 'User Access Review',
    description: 'Quarterly review of user access rights and permissions across all systems',
    category: 'detective',
    control_type: 'manual',
    frequency: 'quarterly',
    owner_id: '2',
    effectiveness: 'partially_effective',
    last_tested: '2024-10-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },
  {
    id: '3',
    control_id: 'CTL-003',
    title: 'Automated Transaction Logging',
    description: 'Automatic logging of all financial transactions with user and timestamp details',
    category: 'detective',
    control_type: 'automated',
    frequency: 'continuous',
    owner_id: '1',
    effectiveness: 'effective',
    last_tested: '2024-12-01',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: '4',
    control_id: 'CTL-004',
    title: 'Password Policy Enforcement',
    description: 'Technical enforcement of password complexity, rotation, and history requirements',
    category: 'preventive',
    control_type: 'automated',
    frequency: 'continuous',
    owner_id: '2',
    effectiveness: 'effective',
    last_tested: '2024-11-20',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
  {
    id: '5',
    control_id: 'CTL-005',
    title: 'Vendor Invoice Three-Way Match',
    description: 'Matching of purchase orders, receiving documents, and vendor invoices before payment',
    category: 'preventive',
    control_type: 'it_dependent',
    frequency: 'continuous',
    owner_id: '1',
    effectiveness: 'not_tested',
    last_tested: null,
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-01T00:00:00Z',
  },
  {
    id: '6',
    control_id: 'CTL-006',
    title: 'Monthly Bank Reconciliation',
    description: 'Reconciliation of bank statements with general ledger cash accounts',
    category: 'detective',
    control_type: 'manual',
    frequency: 'monthly',
    owner_id: '2',
    effectiveness: 'effective',
    last_tested: '2024-11-30',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-11-30T00:00:00Z',
  },
];

export function ControlsPage() {
  const [controls, setControls] = useState<Control[]>(demoControls);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [effectivenessFilter, setEffectivenessFilter] = useState('');

  const [formData, setFormData] = useState({
    control_id: '',
    title: '',
    description: '',
    category: '' as ControlCategory | '',
    control_type: '' as ControlType | '',
    frequency: '' as ControlFrequency | '',
    effectiveness: 'not_tested' as ControlEffectiveness,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newControl: Control = {
      id: Date.now().toString(),
      control_id: formData.control_id || `CTL-${String(controls.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      category: formData.category as ControlCategory,
      control_type: formData.control_type as ControlType,
      frequency: formData.frequency as ControlFrequency,
      owner_id: null,
      effectiveness: formData.effectiveness,
      last_tested: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setControls([newControl, ...controls]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      control_id: '',
      title: '',
      description: '',
      category: '',
      control_type: '',
      frequency: '',
      effectiveness: 'not_tested',
    });
  };

  const filteredControls = controls.filter((control) => {
    const matchesSearch = control.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      control.control_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEffectiveness = !effectivenessFilter || control.effectiveness === effectivenessFilter;
    return matchesSearch && matchesEffectiveness;
  });

  const stats = {
    total: controls.length,
    effective: controls.filter(c => c.effectiveness === 'effective').length,
    partial: controls.filter(c => c.effectiveness === 'partially_effective').length,
    ineffective: controls.filter(c => c.effectiveness === 'ineffective').length,
    notTested: controls.filter(c => c.effectiveness === 'not_tested').length,
  };

  const getEffectivenessIcon = (effectiveness: string) => {
    switch (effectiveness) {
      case 'effective':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'partially_effective':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'ineffective':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div>
      <Header
        title="Controls Library"
        subtitle="Manage and test internal controls"
        showAddButton
        addButtonLabel="New Control"
        onAddClick={() => setShowModal(true)}
      />

      <div className="pt-20 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-slate-50 border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-500">Total Controls</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            </div>
          </Card>
          <Card className="bg-green-50 border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-600">Effective</p>
              <p className="text-2xl font-bold text-green-700">{stats.effective}</p>
            </div>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <div className="text-center">
              <p className="text-sm text-amber-600">Partial</p>
              <p className="text-2xl font-bold text-amber-700">{stats.partial}</p>
            </div>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <div className="text-center">
              <p className="text-sm text-red-600">Ineffective</p>
              <p className="text-2xl font-bold text-red-700">{stats.ineffective}</p>
            </div>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <div className="text-center">
              <p className="text-sm text-slate-500">Not Tested</p>
              <p className="text-2xl font-bold text-slate-700">{stats.notTested}</p>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search controls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={effectivenessFilter}
            onChange={(e) => setEffectivenessFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Effectiveness</option>
            {effectivenessOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredControls.map((control) => (
            <Card key={control.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-slate-500">{control.control_id}</span>
                  {getEffectivenessIcon(control.effectiveness)}
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-slate-900 mb-2">{control.title}</h3>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2">{control.description}</p>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Category</span>
                  <Badge variant="neutral">{control.category}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Type</span>
                  <span className="text-slate-700 capitalize">{control.control_type?.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Frequency</span>
                  <span className="text-slate-700 capitalize">{control.frequency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Effectiveness</span>
                  <Badge variant={getStatusBadgeVariant(control.effectiveness)}>
                    {control.effectiveness.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {control.last_tested && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-sm text-slate-500">
                  Last tested: {format(new Date(control.last_tested), 'MMM d, yyyy')}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Create Control Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add New Control"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Control ID"
              value={formData.control_id}
              onChange={(e) => setFormData({ ...formData, control_id: e.target.value })}
              placeholder="e.g., CTL-007"
            />
            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ControlCategory })}
              required
            />
          </div>

          <Input
            label="Control Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter control title"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the control objective and activities"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Control Type"
              options={typeOptions}
              value={formData.control_type}
              onChange={(e) => setFormData({ ...formData, control_type: e.target.value as ControlType })}
            />

            <Select
              label="Frequency"
              options={frequencyOptions}
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as ControlFrequency })}
            />
          </div>

          <Select
            label="Effectiveness"
            options={effectivenessOptions}
            value={formData.effectiveness}
            onChange={(e) => setFormData({ ...formData, effectiveness: e.target.value as ControlEffectiveness })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Control</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
