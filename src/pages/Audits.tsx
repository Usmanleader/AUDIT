import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { supabase } from '@/lib/supabase';
import {
  ClipboardList,
  Calendar,
  MoreVertical,
  Search,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import type { Audit, AuditType, AuditStatus, Priority } from '@/types';

const auditTypeOptions = [
  { value: 'internal', label: 'Internal Audit' },
  { value: 'external', label: 'External Audit' },
  { value: 'compliance', label: 'Compliance Audit' },
  { value: 'operational', label: 'Operational Audit' },
  { value: 'financial', label: 'Financial Audit' },
  { value: 'it', label: 'IT Audit' },
  { value: 'sox', label: 'SOX Audit' },
];

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'fieldwork', label: 'Fieldwork' },
  { value: 'review', label: 'Review' },
  { value: 'reporting', label: 'Reporting' },
  { value: 'completed', label: 'Completed' },
  { value: 'on_hold', label: 'On Hold' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

// Demo data
const demoAudits: Audit[] = [
  {
    id: '1',
    title: 'Q4 Financial Audit 2024',
    description: 'Comprehensive review of Q4 financial statements and internal controls',
    audit_type: 'financial',
    status: 'fieldwork',
    priority: 'high',
    organization_id: '1',
    lead_auditor_id: '1',
    start_date: '2024-10-01',
    end_date: '2024-12-31',
    budget_hours: 200,
    actual_hours: 145,
    created_by: '1',
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'SOX Compliance Assessment',
    description: 'Annual SOX 404 compliance testing and documentation',
    audit_type: 'sox',
    status: 'planning',
    priority: 'critical',
    organization_id: '2',
    lead_auditor_id: '1',
    start_date: '2024-11-15',
    end_date: '2025-01-31',
    budget_hours: 320,
    actual_hours: 45,
    created_by: '1',
    created_at: '2024-11-01T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
  {
    id: '3',
    title: 'IT Security Review',
    description: 'Review of cybersecurity controls and IT general controls',
    audit_type: 'it',
    status: 'review',
    priority: 'high',
    organization_id: '1',
    lead_auditor_id: '2',
    start_date: '2024-09-01',
    end_date: '2024-12-15',
    budget_hours: 150,
    actual_hours: 138,
    created_by: '1',
    created_at: '2024-08-20T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
  },
  {
    id: '4',
    title: 'Operational Efficiency Audit',
    description: 'Assessment of operational processes and efficiency improvements',
    audit_type: 'operational',
    status: 'completed',
    priority: 'medium',
    organization_id: '3',
    lead_auditor_id: '1',
    start_date: '2024-07-01',
    end_date: '2024-09-30',
    budget_hours: 180,
    actual_hours: 175,
    created_by: '1',
    created_at: '2024-06-15T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },
];

export function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>(demoAudits);
  const [, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAudit, setSelectedAudit] = useState<Audit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    audit_type: '' as AuditType | '',
    status: 'planning' as AuditStatus,
    priority: 'medium' as Priority,
    start_date: '',
    end_date: '',
    budget_hours: '',
  });

  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    // Loading state handled by React
    try {
      const { data, error } = await supabase
        .from('audits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Using demo data - Database tables may not be set up yet');
      } else if (data && data.length > 0) {
        setAudits(data);
      }
    } catch (error) {
      console.log('Using demo data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAudit: Audit = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      audit_type: formData.audit_type as AuditType,
      status: formData.status,
      priority: formData.priority,
      organization_id: null,
      lead_auditor_id: null,
      start_date: formData.start_date,
      end_date: formData.end_date,
      budget_hours: Number(formData.budget_hours) || null,
      actual_hours: 0,
      created_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('audits').insert([{
        title: formData.title,
        description: formData.description,
        audit_type: formData.audit_type,
        status: formData.status,
        priority: formData.priority,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        budget_hours: Number(formData.budget_hours) || null,
      }]);

      if (error) {
        console.log('Adding to local state only');
      }
    } catch (err) {
      console.log('Adding to local state');
    }

    setAudits([newAudit, ...audits]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      audit_type: '',
      status: 'planning',
      priority: 'medium',
      start_date: '',
      end_date: '',
      budget_hours: '',
    });
    setSelectedAudit(null);
  };

  const filteredAudits = audits.filter((audit) => {
    const matchesSearch = audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || audit.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProgressPercentage = (audit: Audit) => {
    if (!audit.budget_hours) return 0;
    return Math.min(Math.round((audit.actual_hours / audit.budget_hours) * 100), 100);
  };

  return (
    <div>
      <Header
        title="Audits"
        subtitle="Manage your audit engagements"
        showAddButton
        addButtonLabel="New Audit"
        onAddClick={() => setShowModal(true)}
      />

      <div className="pt-20 p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search audits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">All Status</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-lg transition-colors',
                viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Audits Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAudits.map((audit) => (
              <Card key={audit.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusBadgeVariant(audit.status)}>
                      {audit.status.replace('_', ' ')}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(audit.priority)}>
                      {audit.priority}
                    </Badge>
                  </div>
                  <button className="p-1 rounded hover:bg-slate-100">
                    <MoreVertical className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <h3 className="font-semibold text-slate-900 mb-2">{audit.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{audit.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ClipboardList className="w-4 h-4" />
                    <span className="capitalize">{audit.audit_type.replace('_', ' ')} Audit</span>
                  </div>

                  {audit.start_date && audit.end_date && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {format(new Date(audit.start_date), 'MMM d')} - {format(new Date(audit.end_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  )}

                  {audit.budget_hours && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-500">Progress</span>
                        <span className="font-medium text-slate-700">
                          {audit.actual_hours}h / {audit.budget_hours}h
                        </span>
                      </div>
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all',
                            getProgressPercentage(audit) >= 90 ? 'bg-red-500' :
                            getProgressPercentage(audit) >= 75 ? 'bg-amber-500' : 'bg-indigo-500'
                          )}
                          style={{ width: `${getProgressPercentage(audit)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                      JS
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-xs font-medium">
                      MC
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card padding="none">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Audit</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Priority</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Progress</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Due Date</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAudits.map((audit) => (
                  <tr key={audit.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-slate-900">{audit.title}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs">{audit.description}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600 capitalize">{audit.audit_type.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(audit.status)}>
                        {audit.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadgeVariant(audit.priority)}>
                        {audit.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-24">
                        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${getProgressPercentage(audit)}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{getProgressPercentage(audit)}%</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-600">
                        {audit.end_date ? format(new Date(audit.end_date), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      {/* Create/Edit Audit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={selectedAudit ? 'Edit Audit' : 'Create New Audit'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Audit Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter audit title"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the audit scope and objectives"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Audit Type"
              options={auditTypeOptions}
              value={formData.audit_type}
              onChange={(e) => setFormData({ ...formData, audit_type: e.target.value as AuditType })}
              required
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as AuditStatus })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
            />

            <Input
              label="Budget Hours"
              type="number"
              value={formData.budget_hours}
              onChange={(e) => setFormData({ ...formData, budget_hours: e.target.value })}
              placeholder="e.g., 200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />

            <Input
              label="End Date"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {selectedAudit ? 'Update Audit' : 'Create Audit'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
