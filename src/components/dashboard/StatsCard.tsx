import { cn } from '@/utils/cn';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  iconColor = 'text-indigo-600',
  iconBgColor = 'bg-indigo-100',
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              {isPositive ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : isNegative ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : null}
              <span
                className={cn(
                  'text-sm font-medium',
                  isPositive && 'text-emerald-600',
                  isNegative && 'text-red-600',
                  !isPositive && !isNegative && 'text-slate-500'
                )}
              >
                {isPositive && '+'}
                {change}%
              </span>
              <span className="text-sm text-slate-400">{changeLabel}</span>
            </div>
          )}
        </div>
        
        <div className={cn('p-3 rounded-xl', iconBgColor)}>
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
      </div>
    </div>
  );
}
