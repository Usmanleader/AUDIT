import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import { Input, Textarea } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { AlertTriangle, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { Risk, RiskCategory, RiskStatus } from '@/types';

const categoryOptions = [
  { value: 'strategic', label: 'Strategic' },
  { value: 'operational', label: 'Operational' },
  { value: 'financial', label: 'Financial' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'technology', label: 'Technology' },
  { value: 'reputational', label: 'Reputational' },
];

const statusOptions = [
  { value: 'identified', label: 'Identified' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'mitigating', label: 'Mitigating' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'closed', label: 'Closed' },
];

const demoRisks: Risk[] = [
  {
    id: '1',
    title: 'Cybersecurity Breach',
    description: 'Risk of unauthorized access to sensitive customer data',
    category: 'technology',
    likelihood: 4,
    impact: 5,
    risk_score: 20,
    risk_level: 'critical',
    mitigation_plan: 'Implement advanced threat detection and response systems',
    owner_id: '1',
    audit_id: '1',
    status: 'mitigating',
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Regulatory Non-Compliance',
    description: 'Failure to meet new regulatory requirements',
    category: 'compliance',
    likelihood: 3,
    impact: 4,
    risk_score: 12,
    risk_level: 'high',
    mitigation_plan: 'Regular compliance monitoring and staff training',
    owner_id: '2',
    audit_id: '2',
    status: 'assessed',
    created_at: '2024-02-20T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Third-Party Vendor Risk',
    description: 'Dependencies on critical third-party service providers',
    category: 'operational',
    likelihood: 3,
    impact: 3,
    risk_score: 9,
    risk_level: 'medium',
    mitigation_plan: 'Vendor risk assessments and backup vendor identification',
    owner_id: '1',
    audit_id: null,
    status: 'mitigating',
    created_at: '2024-03-10T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
  {
    id: '4',
    title: 'Market Volatility',
    description: 'Financial impact from market fluctuations',
    category: 'financial',
    likelihood: 4,
    impact: 3,
    risk_score: 12,
    risk_level: 'high',
    mitigation_plan: 'Diversification and hedging strategies',
    owner_id: '2',
    audit_id: null,
    status: 'accepted',
    created_at: '2024-04-05T00:00:00Z',
    updated_at: '2024-09-30T00:00:00Z',
  },
  {
    id: '5',
    title: 'Key Personnel Dependency',
    description: 'Risk of losing critical knowledge when key staff leave',
    category: 'operational',
    likelihood: 2,
    impact: 3,
    risk_score: 6,
    risk_level: 'medium',
    mitigation_plan: 'Knowledge documentation and cross-training programs',
    owner_id: '1',
    audit_id: null,
    status: 'identified',
    created_at: '2024-05-12T00:00:00Z',
    updated_at: '2024-08-25T00:00:00Z',
  },
  {
    id: '6',
    title: 'Brand Reputation Damage',
    description: 'Negative publicity affecting customer trust',
    category: 'reputational',
    likelihood: 2,
    impact: 4,
    risk_score: 8,
    risk_level: 'medium',
    mitigation_plan: 'Crisis communication plan and social media monitoring',
    owner_id: '2',
    audit_id: null,
    status: 'assessed',
    created_at: '2024-06-18T00:00:00Z',
    updated_at: '2024-07-30T00:00:00Z',
  },
];

export function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>(demoRisks);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as RiskCategory | '',
    likelihood: 3,
    impact: 3,
    mitigation_plan: '',
    status: 'identified' as RiskStatus,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const score = formData.likelihood * formData.impact;
    const level = score >= 20 ? 'critical' : score >= 12 ? 'high' : score >= 6 ? 'medium' : 'low';

    const newRisk: Risk = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category as RiskCategory,
      likelihood: formData.likelihood,
      impact: formData.impact,
      risk_score: score,
      risk_level: level,
      mitigation_plan: formData.mitigation_plan,
      owner_id: null,
      audit_id: null,
      status: formData.status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setRisks([newRisk, ...risks]);
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      likelihood: 3,
      impact: 3,
      mitigation_plan: '',
      status: 'identified',
    });
  };

  const filteredRisks = risks.filter((risk) => {
    const matchesSearch = risk.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || risk.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getRiskColor = (score: number) => {
    if (score >= 20) return 'bg-red-500';
    if (score >= 12) return 'bg-orange-500';
    if (score >= 6) return 'bg-amber-500';
    return 'bg-green-500';
  };

  // Risk Matrix Data
  const matrixData: (Risk | null)[][][] = Array(5).fill(null).map(() => 
    Array(5).fill(null).map(() => [])
  );

  risks.forEach(risk => {
    const row = 5 - risk.impact;
    const col = risk.likelihood - 1;
    if (matrixData[row] && matrixData[row][col]) {
      matrixData[row][col].push(risk);
    }
  });

  return (
    <div>
      <Header
        title="Risk Assessment"
        subtitle="Identify, assess, and manage organizational risks"
        showAddButton
        addButtonLabel="New Risk"
        onAddClick={() => setShowModal(true)}
      />

      <div className="pt-20 p-6 space-y-6">
        {/* Risk Matrix */}
        <Card>
          <CardHeader title="Risk Heat Map" subtitle="Likelihood vs Impact Matrix" />
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="flex">
                <div className="w-12 flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-slate-500 transform -rotate-90 whitespace-nowrap">
                    IMPACT →
                  </span>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-5 gap-1">
                    {/* Matrix cells */}
                    {matrixData.map((row, rowIdx) => (
                      row.map((cell, colIdx) => {
                        const score = (5 - rowIdx) * (colIdx + 1);
                        const bgColor = score >= 20 ? 'bg-red-100 hover:bg-red-200' :
                                       score >= 12 ? 'bg-orange-100 hover:bg-orange-200' :
                                       score >= 6 ? 'bg-amber-100 hover:bg-amber-200' :
                                       'bg-green-100 hover:bg-green-200';
                        
                        return (
                          <div
                            key={`${rowIdx}-${colIdx}`}
                            className={cn(
                              'aspect-square p-2 rounded-lg transition-colors cursor-pointer',
                              bgColor
                            )}
                          >
                            <div className="h-full flex flex-col items-center justify-center gap-1">
                              {cell.length > 0 && (
                                <>
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {cell.slice(0, 3).map((risk, idx) => {
                                      if (!risk) return null;
                                      return (
                                        <div
                                          key={idx}
                                          className={cn(
                                            'w-3 h-3 rounded-full',
                                            getRiskColor(risk.risk_score)
                                          )}
                                          title={risk.title}
                                        />
                                      );
                                    })}
                                  </div>
                                  {cell.length > 3 && (
                                    <span className="text-xs text-slate-600">
                                      +{cell.length - 3}
                                    </span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ))}
                  </div>
                  {/* X-axis labels */}
                  <div className="grid grid-cols-5 gap-1 mt-2">
                    {['Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'].map((label) => (
                      <div key={label} className="text-center text-xs text-slate-500">
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-xs font-medium text-slate-500 mt-1">
                    LIKELIHOOD →
                  </div>
                </div>
                {/* Y-axis labels */}
                <div className="w-20 flex flex-col justify-between py-1 pl-2">
                  {['Critical', 'Major', 'Moderate', 'Minor', 'Negligible'].map((label) => (
                    <div key={label} className="text-xs text-slate-500 text-left">
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t">
            <span className="text-sm text-slate-500">Risk Level:</span>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-slate-600">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm text-slate-600">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-sm text-slate-600">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-slate-600">Critical</span>
            </div>
          </div>
        </Card>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search risks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="">All Categories</option>
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Risk Register */}
        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Risk</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Category</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-500">L</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-500">I</th>
                <th className="text-center px-4 py-3 text-sm font-medium text-slate-500">Score</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Level</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Status</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRisks.map((risk) => (
                <tr key={risk.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'p-2 rounded-lg',
                        risk.risk_level === 'critical' ? 'bg-red-100' :
                        risk.risk_level === 'high' ? 'bg-orange-100' :
                        risk.risk_level === 'medium' ? 'bg-amber-100' : 'bg-green-100'
                      )}>
                        <AlertTriangle className={cn(
                          'w-4 h-4',
                          risk.risk_level === 'critical' ? 'text-red-600' :
                          risk.risk_level === 'high' ? 'text-orange-600' :
                          risk.risk_level === 'medium' ? 'text-amber-600' : 'text-green-600'
                        )} />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{risk.title}</p>
                        <p className="text-sm text-slate-500 truncate max-w-xs">{risk.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-slate-600 capitalize">{risk.category}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-slate-700">{risk.likelihood}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm font-medium text-slate-700">{risk.impact}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      'inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white',
                      getRiskColor(risk.risk_score)
                    )}>
                      {risk.risk_score}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadgeVariant(risk.risk_level)}>
                      {risk.risk_level}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={getStatusBadgeVariant(risk.status)}>
                      {risk.status}
                    </Badge>
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
      </div>

      {/* Create Risk Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title="Add New Risk"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Risk Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter risk title"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the risk"
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as RiskCategory })}
              required
            />

            <Select
              label="Status"
              options={statusOptions}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as RiskStatus })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Likelihood (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.likelihood}
                onChange={(e) => setFormData({ ...formData, likelihood: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Rare</span>
                <span className="font-medium text-slate-700">{formData.likelihood}</span>
                <span>Almost Certain</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Impact (1-5)
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: Number(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>Negligible</span>
                <span className="font-medium text-slate-700">{formData.impact}</span>
                <span>Critical</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-500 mb-1">Calculated Risk Score</p>
            <div className="flex items-center gap-3">
              <span className={cn(
                'inline-flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold text-white',
                getRiskColor(formData.likelihood * formData.impact)
              )}>
                {formData.likelihood * formData.impact}
              </span>
              <span className="text-slate-600">
                {formData.likelihood * formData.impact >= 20 ? 'Critical Risk' :
                 formData.likelihood * formData.impact >= 12 ? 'High Risk' :
                 formData.likelihood * formData.impact >= 6 ? 'Medium Risk' : 'Low Risk'}
              </span>
            </div>
          </div>

          <Textarea
            label="Mitigation Plan"
            value={formData.mitigation_plan}
            onChange={(e) => setFormData({ ...formData, mitigation_plan: e.target.value })}
            placeholder="How will this risk be mitigated?"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Risk</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
