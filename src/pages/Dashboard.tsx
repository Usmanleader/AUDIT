import { Header } from '@/components/layout/Header';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { FindingsTrendChart, AuditStatusChart, RiskDistributionChart } from '@/components/dashboard/AuditChart';
import { RecentActivity, UpcomingTasks } from '@/components/dashboard/RecentActivity';
import {
  ClipboardList,
  FileWarning,
  AlertTriangle,
  Shield,
  Clock,
} from 'lucide-react';

export function Dashboard() {
  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what's happening with your audits."
      />
      
      <div className="pt-20 p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Active Audits"
            value={12}
            change={8}
            icon={ClipboardList}
            iconColor="text-indigo-600"
            iconBgColor="bg-indigo-100"
          />
          <StatsCard
            title="Open Findings"
            value={34}
            change={-12}
            icon={FileWarning}
            iconColor="text-amber-600"
            iconBgColor="bg-amber-100"
          />
          <StatsCard
            title="Critical Risks"
            value={5}
            change={25}
            icon={AlertTriangle}
            iconColor="text-red-600"
            iconBgColor="bg-red-100"
          />
          <StatsCard
            title="Controls Tested"
            value={148}
            change={15}
            icon={Shield}
            iconColor="text-emerald-600"
            iconBgColor="bg-emerald-100"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FindingsTrendChart />
          </div>
          <AuditStatusChart />
        </div>

        {/* Activity & Tasks Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
          <UpcomingTasks />
        </div>

        {/* Quick Actions & Risk Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionCard
                  icon={ClipboardList}
                  title="New Audit"
                  description="Start a new audit engagement"
                  color="indigo"
                />
                <QuickActionCard
                  icon={FileWarning}
                  title="Log Finding"
                  description="Document a new finding"
                  color="amber"
                />
                <QuickActionCard
                  icon={AlertTriangle}
                  title="Add Risk"
                  description="Register a new risk"
                  color="red"
                />
                <QuickActionCard
                  icon={Shield}
                  title="Test Control"
                  description="Record control test"
                  color="emerald"
                />
              </div>
            </div>
          </div>
          <RiskDistributionChart />
        </div>

        {/* Audit Progress Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Audit Progress</h3>
          <div className="space-y-4">
            <AuditProgressItem
              title="Q4 Financial Audit"
              client="Acme Corporation"
              progress={75}
              status="fieldwork"
              dueDate="Dec 31, 2024"
            />
            <AuditProgressItem
              title="SOX Compliance Audit"
              client="TechStart Inc."
              progress={45}
              status="planning"
              dueDate="Jan 15, 2025"
            />
            <AuditProgressItem
              title="IT Security Review"
              client="Global Finance Ltd"
              progress={90}
              status="review"
              dueDate="Dec 20, 2024"
            />
            <AuditProgressItem
              title="Operational Efficiency Audit"
              client="Retail Partners Co."
              progress={30}
              status="planning"
              dueDate="Feb 28, 2025"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'indigo' | 'amber' | 'red' | 'emerald';
}

function QuickActionCard({ icon: Icon, title, description, color }: QuickActionCardProps) {
  const colors = {
    indigo: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600',
    amber: 'bg-amber-50 hover:bg-amber-100 text-amber-600',
    red: 'bg-red-50 hover:bg-red-100 text-red-600',
    emerald: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600',
  };

  return (
    <button
      className={`p-4 rounded-xl ${colors[color]} transition-colors text-left group`}
    >
      <Icon className="w-6 h-6 mb-2" />
      <p className="font-medium text-slate-900">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </button>
  );
}

interface AuditProgressItemProps {
  title: string;
  client: string;
  progress: number;
  status: string;
  dueDate: string;
}

function AuditProgressItem({ title, client, progress, status, dueDate }: AuditProgressItemProps) {
  const statusColors: Record<string, string> = {
    planning: 'bg-blue-500',
    fieldwork: 'bg-amber-500',
    review: 'bg-purple-500',
    reporting: 'bg-indigo-500',
    completed: 'bg-emerald-500',
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-slate-900">{title}</p>
          <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${statusColors[status] || 'bg-slate-500'}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{client}</p>
      </div>
      <div className="w-32">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${statusColors[status] || 'bg-slate-500'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">{dueDate}</span>
        </div>
      </div>
    </div>
  );
}
