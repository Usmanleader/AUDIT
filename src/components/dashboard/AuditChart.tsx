import { Card, CardHeader } from '@/components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const findingsTrendData = [
  { month: 'Jan', findings: 12, resolved: 8 },
  { month: 'Feb', findings: 19, resolved: 14 },
  { month: 'Mar', findings: 15, resolved: 12 },
  { month: 'Apr', findings: 22, resolved: 18 },
  { month: 'May', findings: 18, resolved: 16 },
  { month: 'Jun', findings: 25, resolved: 20 },
];

const auditStatusData = [
  { name: 'Completed', value: 12, color: '#10b981' },
  { name: 'In Progress', value: 8, color: '#f59e0b' },
  { name: 'Planning', value: 5, color: '#6366f1' },
  { name: 'On Hold', value: 2, color: '#94a3b8' },
];

const riskDistributionData = [
  { name: 'Critical', value: 3, color: '#ef4444' },
  { name: 'High', value: 8, color: '#f97316' },
  { name: 'Medium', value: 15, color: '#f59e0b' },
  { name: 'Low', value: 24, color: '#10b981' },
];

export function FindingsTrendChart() {
  return (
    <Card>
      <CardHeader title="Findings Trend" subtitle="Monthly findings vs resolved" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={findingsTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="findings" name="New Findings" fill="#6366f1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function AuditStatusChart() {
  return (
    <Card>
      <CardHeader title="Audit Status" subtitle="Current audit distribution" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={auditStatusData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {auditStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export function RiskDistributionChart() {
  return (
    <Card>
      <CardHeader title="Risk Distribution" subtitle="By severity level" />
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={riskDistributionData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {riskDistributionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
