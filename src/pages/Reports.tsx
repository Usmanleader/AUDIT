import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Download,
  Eye,
  Calendar,
  TrendingUp,
  PieChart,
  BarChart3,
  FileBarChart,
} from 'lucide-react';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: React.ElementType;
  lastGenerated?: string;
}

const reportTemplates: ReportTemplate[] = [
  {
    id: '1',
    name: 'Executive Summary Report',
    description: 'High-level overview of audit activities, findings, and risk status',
    type: 'executive_summary',
    icon: FileText,
    lastGenerated: '2024-12-01',
  },
  {
    id: '2',
    name: 'Audit Status Report',
    description: 'Detailed status of all active and completed audits',
    type: 'audit_report',
    icon: BarChart3,
    lastGenerated: '2024-11-28',
  },
  {
    id: '3',
    name: 'Findings Analysis Report',
    description: 'Comprehensive analysis of findings by severity, status, and trend',
    type: 'finding_report',
    icon: TrendingUp,
    lastGenerated: '2024-11-25',
  },
  {
    id: '4',
    name: 'Risk Assessment Report',
    description: 'Risk register with heat map and mitigation status',
    type: 'risk_assessment',
    icon: PieChart,
    lastGenerated: '2024-11-20',
  },
  {
    id: '5',
    name: 'Control Effectiveness Report',
    description: 'Summary of control testing results and effectiveness ratings',
    type: 'control_report',
    icon: FileBarChart,
  },
  {
    id: '6',
    name: 'Quarterly Audit Report',
    description: 'Comprehensive quarterly report of all audit activities',
    type: 'quarterly_report',
    icon: Calendar,
    lastGenerated: '2024-09-30',
  },
];

const recentReports = [
  {
    id: '1',
    name: 'Q3 2024 Executive Summary',
    type: 'Executive Summary',
    generatedBy: 'John Smith',
    date: '2024-12-01',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'SOX Compliance Audit Report',
    type: 'Audit Report',
    generatedBy: 'Sarah Johnson',
    date: '2024-11-28',
    size: '5.1 MB',
  },
  {
    id: '3',
    name: 'November Findings Summary',
    type: 'Finding Report',
    generatedBy: 'Mike Chen',
    date: '2024-11-25',
    size: '1.8 MB',
  },
  {
    id: '4',
    name: 'Annual Risk Assessment 2024',
    type: 'Risk Assessment',
    generatedBy: 'John Smith',
    date: '2024-11-20',
    size: '3.2 MB',
  },
];

export function ReportsPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleGenerateReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    // In a real app, this would trigger report generation
    setTimeout(() => {
      setSelectedTemplate(null);
      alert('Report generated successfully!');
    }, 2000);
  };

  return (
    <div>
      <Header
        title="Reports"
        subtitle="Generate and manage audit reports"
      />

      <div className="pt-20 p-6 space-y-6">
        {/* Report Templates */}
        <Card>
          <CardHeader title="Report Templates" subtitle="Select a template to generate a report" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  className="p-4 border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-200 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{template.name}</h4>
                      <p className="text-sm text-slate-500 mt-1">{template.description}</p>
                      {template.lastGenerated && (
                        <p className="text-xs text-slate-400 mt-2">
                          Last generated: {template.lastGenerated}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGenerateReport(template.id)}
                      isLoading={selectedTemplate === template.id}
                      className="flex-1"
                    >
                      Generate
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader 
            title="Recent Reports" 
            subtitle="Previously generated reports"
            action={
              <Button size="sm" variant="outline">
                View All
              </Button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Report Name</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Type</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Generated By</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Date</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-500">Size</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="font-medium text-slate-900">{report.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="neutral">{report.type}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{report.generatedBy}</td>
                    <td className="px-4 py-3 text-slate-600">{report.date}</td>
                    <td className="px-4 py-3 text-slate-600">{report.size}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <p className="text-sm text-slate-500">Reports This Month</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">12</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-slate-500">Most Generated</p>
            <p className="text-lg font-semibold text-slate-900 mt-1">Executive Summary</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-slate-500">Total Reports</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">156</p>
          </Card>
          <Card className="text-center">
            <p className="text-sm text-slate-500">Storage Used</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">2.4 GB</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
