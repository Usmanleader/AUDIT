import { cn } from '@/utils/cn';
import {
  LayoutDashboard,
  ClipboardList,
  AlertTriangle,
  Shield,
  FileWarning,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Building2,
} from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

const navigation: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, href: 'dashboard' },
  { name: 'Audits', icon: ClipboardList, href: 'audits' },
  { name: 'Findings', icon: FileWarning, href: 'findings', badge: 5 },
  { name: 'Risks', icon: AlertTriangle, href: 'risks' },
  { name: 'Controls', icon: Shield, href: 'controls' },
  { name: 'Reports', icon: FileText, href: 'reports' },
  { name: 'Organizations', icon: Building2, href: 'organizations' },
];

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { sidebarCollapsed, toggleSidebarCollapse } = useUIStore();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40 flex flex-col',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-bold text-lg">AuditPro</span>
          )}
        </div>
        <button
          onClick={toggleSidebarCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft
            className={cn(
              'w-5 h-5 transition-transform duration-300',
              sidebarCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = currentPage === item.href;
          return (
            <button
              key={item.name}
              onClick={() => onNavigate(item.href)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <>
                  <span className="flex-1 text-left text-sm font-medium">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 border-t border-slate-800 space-y-1">
        <button
          onClick={() => onNavigate('settings')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            currentPage === 'settings'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
          )}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">Settings</span>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!sidebarCollapsed && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}
