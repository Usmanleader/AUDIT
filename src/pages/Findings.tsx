import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import {
  FileWarning,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import type { Finding, FindingSeverity, FindingStatus } from '@/types';

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'remediated', label: 'Remediated' },
  { value: 'closed', label: 'Closed' },
  { value: 'accepted', label: 'Accepted' },
];

const demoFindings: Finding[] = [
  {
    id: '1',
    finding_id: 'FND-2024-001',
    title: 'Inadequate Access Controls in Payment System',
    description: 'Users have excessive access privileges to the payment processing module, violating the principle of least privilege.',
    audit_id: '1',
    risk_id: null,
    control_id: null,
    severity: 'high',
    status: 'open',
    root_cause: 'Lack of periodic access reviews and role-based access control implementation',
    recommendation: 'Implement RBAC and conduct quarterly access reviews',
    management_response: null,
    remediation_date: '2025-01-31',
    owner_id: '1',
    identified_by: '1',
    identified_date: '2024-12-01',
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
  },
  {
    id: '2',
    finding_id: 'FND-2024-002',
    title: 'Missing Audit Trail in Inventory Module',
    description: 'Critical changes to inventory records are not being logged, making it difficult to track unauthorized modifications.',
    audit_id: '1',
    risk_id: null,
    control_id: null,
    severity: 'critical',
    status: 'in_progress',
    root_cause: 'Audit logging was disabled during a system upgrade and never re-enabled',
    recommendation: 'Enable comprehensive audit logging and implement log monitoring',
    management_response: 'Agreed. IT team is working on enabling audit logs.',
    remediation_date: '2024-12-31',
    owner_id: '2',
    identified_by: '1',
    identified_date: '2024-11-15',
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-12-10T00:00:00Z',
  },
  {
    id: '3',
    finding_id: 'FND-2024-003',
    title: 'Weak Password Policy',
    description: 'Current password policy allows weak passwords that do not meet industry standards.',
    audit_id: '2',
    risk_id: null,
    control_id: null,
    severity: 'medium',
    status: 'remediated',
    root_cause: 'Password policy was never updated to align with current security standards',
    recommendation: 'Implement password policy requiring minimum 12 characters, complexity, and 90-day rotation',
    management_response: 'Implemented new password policy across all systems.',
    remediation_date: '2024-11-30',
    owner_id: '1',
    identified_by: '2',
    identified_date: '2024-10-20',
    created_at: '2024-10-20T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: '4',
    finding_id: 'FND-2024-004',
    title: 'Segregation of Duties Violation',
    description: 'Same user can create and approve purchase orders without secondary approval.',
    audit_id: '3',
    risk_id: null,
    control_id: null,
    severity: 'high',
    status: 'open',
    root_cause: 'Workflow configuration allows bypassing approval requirements',
    recommendation: 'Configure system to enforce mandatory secondary approval for all POs',
    management_response: null,
    remediation_date: '2025-02-15',
    owner_id: '1',
    identified_by: '1',
    identified_date: '2024-12-05',
    created_at: '2024-12-05T00:00:00Z',
    updated_at: '2024-12-05T00:00:00Z',
  },
  {
    id: '5',
    finding_id: 'FND-2024-005',
    title: 'Incomplete Backup Verification',
    description: 'Backup restoration tests are not performed regularly to verify backup integrity.',
    audit_id: '3',
    risk_id: null,
    control_id: null,
    severity: 'low',
    status: 'closed',
    root_cause: 'No documented procedure for regular backup testing',
    recommendation: 'Establish quarterly backup restoration testing procedure',
    management_response: 'Quarterly backup testing schedule implemented.',
    remediation_date: '2024-11-15',
    owner_id: '2',
    identified_by: '2',
    identified_date: '2024-09-10',
    created_at: '2024-09-10T00:00:00Z',
    updated_at: '2024-11-20T00:00:00Z',
  },
];

export function FindingsPage() {
  const [findings, setFindings] = useState<Finding[]>(demoFindings);
  const [showModal, setShowModal] = useState(false);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium' as FindingSeverity,
    status: 'draft' as FindingStatus,
    root_cause: '',
    recommendation: '',
    remediation_date: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFinding: Finding = {
      id: Date.now().toString(),
      finding_id: `FND-2024-${String(findings.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      audit_id: null,
      risk_id: null,
      control_id: null,
      severity: formData.severity,
      status: formData.status,
      root_cause: formData.root_cause,
      recommendation: formData.recommendation,
      management_response: null,
      remediation_date: formData.remediation_date,
      owner_id: null,
      identified_by: null,
      identified_date: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setFindings([newFinding, ...findings]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      severity: 'medium',
      status: 'draft',
      root_cause: '',
      recommendation: '',
      remediation_date: '',
    });
    setSelectedFinding(null);
  };

  const filteredFindings = findings.filter((finding) => {
    const matchesSearch = finding.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      finding.finding_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = !severityFilter || finding.severity === severityFilter;
    const matchesStatus = !statusFilter || finding.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const stats = {
    total: findings.length,
    open: findings.filter(f => f.status === 'open' || f.status === 'in_progress').length,
    critical: findings.filter(f => f.severity === 'critical' && f.status !== 'closed').length,
    overdue: findings.filter(f => {
      if (!f.remediation_date || f.status === 'closed' || f.status === 'remediated') return false;
      return new Date(f.remediation_date) < new Date();
    }).length,
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'high':
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <Clock className="w-4 h-4 text-amber-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  return (
    <div>
      <Header
        title="Findings"
        subtitle="Track and manage audit findings"
        showAddButton
        addButtonLabel="New Finding"
        onAddClick={() => setShowModal(true)}
      />

      <div className="pt-20 p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Findings</p>
                <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              </div>
              <FileWarning className="w-8 h-8 text-slate-400" />
            </div>
          </Card>
          <Card className="bg-amber-50 border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-600">Open</p>
                <p className="text-2xl font-bold text-amber-700">{stats.open}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-400" />
            </div>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Critical</p>
                <p className="text-2xl font-bold text-red-700">{stats.critical}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
          </Card>
          <Card className="bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Overdue</p>
                <p className="text-2xl font-bold text-orange-700">{stats.overdue}</p>
              </div>
              <ArrowUpRight className="w-8 h-8 text-orange-400" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search findings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Severity</option>
            {severityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
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

        {/* Findings List */}
        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <Card key={finding.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={cn(
                  'p-2 rounded-lg',
                  finding.severity === 'critical' ? 'bg-red-100' :
                  finding.severity === 'high' ? 'bg-orange-100' :
                  finding.severity === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                )}>
                  {getSeverityIcon(finding.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-mono text-slate-500">{finding.finding_id}</span>
                    <Badge variant={getStatusBadgeVariant(finding.severity)}>
                      {finding.severity}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(finding.status)}>
                      {finding.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">{finding.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{finding.description}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                    <span>Identified: {format(new Date(finding.identified_date), 'MMM d, yyyy')}</span>
                    {finding.remediation_date && (
                      <span className={cn(
                        'flex items-center gap-1',
                        new Date(finding.remediation_date) < new Date() && 
                        finding.status !== 'closed' && 
                        finding.status !== 'remediated' ? 'text-red-500' : ''
                      )}>
                        <Clock className="w-3.5 h-3.5" />
                        Due: {format(new Date(finding.remediation_date), 'MMM d, yyyy')}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button 
                    onClick={() => setSelectedFinding(finding)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                  >
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

              {finding.recommendation && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm">
                    <span className="font-medium text-slate-700">Recommendation: </span>
                    <span className="text-slate-500">{finding.recommendation}</span>
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Create Finding Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Create New Finding"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Finding Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter finding title"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the finding in detail"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Severity"
              options={severityOptions}
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value as FindingSeverity })}
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as FindingStatus })}
            />
          </div>

          <Textarea
            label="Root Cause"
            value={formData.root_cause}
            onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
            placeholder="What caused this issue?"
          />

          <Textarea
            label="Recommendation"
            value={formData.recommendation}
            onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
            placeholder="What should be done to address this?"
          />

          <Input
            label="Remediation Due Date"
            type="date"
            value={formData.remediation_date}
            onChange={(e) => setFormData({ ...formData, remediation_date: e.target.value })}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Finding</Button>
          </div>
        </form>
      </Modal>

      {/* Finding Detail Modal */}
      <Modal
        isOpen={!!selectedFinding}
        onClose={() => setSelectedFinding(null)}
        title={selectedFinding?.finding_id || ''}
        size="lg"
      >
        {selectedFinding && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{selectedFinding.title}</h3>
              <div className="flex gap-2">
                <Badge variant={getStatusBadgeVariant(selectedFinding.severity)}>
                  {selectedFinding.severity}
                </Badge>
                <Badge variant={getStatusBadgeVariant(selectedFinding.status)}>
                  {selectedFinding.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-slate-700 mb-1">Description</h4>
              <p className="text-slate-600">{selectedFinding.description}</p>
            </div>

            {selectedFinding.root_cause && (
              <div>
                <h4 className="font-medium text-slate-700 mb-1">Root Cause</h4>
                <p className="text-slate-600">{selectedFinding.root_cause}</p>
              </div>
            )}

            {selectedFinding.recommendation && (
              <div>
                <h4 className="font-medium text-slate-700 mb-1">Recommendation</h4>
                <p className="text-slate-600">{selectedFinding.recommendation}</p>
              </div>
            )}

            {selectedFinding.management_response && (
              <div>
                <h4 className="font-medium text-slate-700 mb-1">Management Response</h4>
                <p className="text-slate-600">{selectedFinding.management_response}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-slate-500">Identified Date</p>
                <p className="font-medium">{format(new Date(selectedFinding.identified_date), 'MMMM d, yyyy')}</p>
              </div>
              {selectedFinding.remediation_date && (
                <div>
                  <p className="text-sm text-slate-500">Remediation Due</p>
                  <p className="font-medium">{format(new Date(selectedFinding.remediation_date), 'MMMM d, yyyy')}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
