import { Card, CardHeader } from '@/components/ui/Card';
import { Badge, getStatusBadgeVariant } from '@/components/ui/Badge';
import {
  ClipboardList,
  FileWarning,
  AlertTriangle,
  Shield,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Activity {
  id: string;
  type: 'audit' | 'finding' | 'risk' | 'control';
  action: string;
  title: string;
  user: string;
  time: string;
  status?: string;
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'finding',
    action: 'New finding created',
    title: 'Inadequate access controls in payment system',
    user: 'Sarah Johnson',
    time: '5 min ago',
    status: 'high',
  },
  {
    id: '2',
    type: 'audit',
    action: 'Audit status updated',
    title: 'Q4 Financial Audit',
    user: 'John Smith',
    time: '23 min ago',
    status: 'fieldwork',
  },
  {
    id: '3',
    type: 'risk',
    action: 'Risk assessment completed',
    title: 'Third-party vendor risk',
    user: 'Mike Chen',
    time: '1 hour ago',
    status: 'medium',
  },
  {
    id: '4',
    type: 'control',
    action: 'Control tested',
    title: 'CTL-045: Segregation of Duties',
    user: 'Emily Davis',
    time: '2 hours ago',
    status: 'effective',
  },
  {
    id: '5',
    type: 'finding',
    action: 'Finding remediated',
    title: 'Missing audit trail in inventory module',
    user: 'John Smith',
    time: '3 hours ago',
    status: 'closed',
  },
];

const typeIcons = {
  audit: ClipboardList,
  finding: FileWarning,
  risk: AlertTriangle,
  control: Shield,
};

const typeColors = {
  audit: 'bg-indigo-100 text-indigo-600',
  finding: 'bg-amber-100 text-amber-600',
  risk: 'bg-red-100 text-red-600',
  control: 'bg-emerald-100 text-emerald-600',
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader
        title="Recent Activity"
        subtitle="Latest updates across all modules"
        action={
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </button>
        }
      />
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = typeIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className={cn('p-2 rounded-lg', typeColors[activity.type])}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {activity.title}
                  </p>
                  {activity.status && (
                    <Badge variant={getStatusBadgeVariant(activity.status)} size="sm">
                      {activity.status.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5">
                  {activity.action} by <span className="font-medium">{activity.user}</span>
                </p>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// Upcoming Tasks Component
interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: string;
  assignee: string;
  completed: boolean;
}

const upcomingTasks: Task[] = [
  {
    id: '1',
    title: 'Complete fieldwork for SOX Audit',
    dueDate: 'Today',
    priority: 'high',
    assignee: 'John Smith',
    completed: false,
  },
  {
    id: '2',
    title: 'Review control test documentation',
    dueDate: 'Tomorrow',
    priority: 'medium',
    assignee: 'Sarah Johnson',
    completed: false,
  },
  {
    id: '3',
    title: 'Submit Q3 audit report',
    dueDate: 'Dec 20',
    priority: 'high',
    assignee: 'Mike Chen',
    completed: false,
  },
  {
    id: '4',
    title: 'Follow up on remediation plan',
    dueDate: 'Dec 22',
    priority: 'low',
    assignee: 'Emily Davis',
    completed: true,
  },
];

export function UpcomingTasks() {
  return (
    <Card>
      <CardHeader
        title="Upcoming Tasks"
        subtitle="Your pending assignments"
        action={
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            View all
          </button>
        }
      />
      <div className="space-y-3">
        {upcomingTasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              'flex items-center gap-3 p-3 rounded-lg border',
              task.completed
                ? 'bg-slate-50 border-slate-200'
                : 'bg-white border-slate-200 hover:border-indigo-200'
            )}
          >
            <button
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                task.completed
                  ? 'border-emerald-500 bg-emerald-500'
                  : 'border-slate-300 hover:border-indigo-500'
              )}
            >
              {task.completed && <CheckCircle className="w-4 h-4 text-white" />}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium truncate',
                  task.completed ? 'text-slate-400 line-through' : 'text-slate-900'
                )}
              >
                {task.title}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Due: {task.dueDate} • {task.assignee}
              </p>
            </div>
            <Badge variant={getStatusBadgeVariant(task.priority)} size="sm">
              {task.priority}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}
