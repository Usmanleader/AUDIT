// User & Authentication Types
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'manager' | 'auditor' | 'viewer';
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

// Organization Types
export interface Organization {
  id: string;
  name: string;
  industry: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

// Audit Types
export type AuditType = 'internal' | 'external' | 'compliance' | 'operational' | 'financial' | 'it' | 'sox';
export type AuditStatus = 'planning' | 'fieldwork' | 'review' | 'reporting' | 'completed' | 'on_hold';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface Audit {
  id: string;
  title: string;
  description: string | null;
  audit_type: AuditType;
  status: AuditStatus;
  priority: Priority;
  organization_id: string | null;
  organization?: Organization;
  lead_auditor_id: string | null;
  lead_auditor?: User;
  start_date: string | null;
  end_date: string | null;
  budget_hours: number | null;
  actual_hours: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// Risk Types
export type RiskCategory = 'strategic' | 'operational' | 'financial' | 'compliance' | 'technology' | 'reputational';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskStatus = 'identified' | 'assessed' | 'mitigating' | 'accepted' | 'closed';

export interface Risk {
  id: string;
  title: string;
  description: string | null;
  category: RiskCategory | null;
  likelihood: number;
  impact: number;
  risk_score: number;
  risk_level: RiskLevel;
  mitigation_plan: string | null;
  owner_id: string | null;
  owner?: User;
  audit_id: string | null;
  audit?: Audit;
  status: RiskStatus;
  created_at: string;
  updated_at: string;
}

// Control Types
export type ControlCategory = 'preventive' | 'detective' | 'corrective' | 'directive';
export type ControlType = 'manual' | 'automated' | 'it_dependent';
export type ControlFrequency = 'continuous' | 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
export type ControlEffectiveness = 'not_tested' | 'effective' | 'partially_effective' | 'ineffective';

export interface Control {
  id: string;
  control_id: string;
  title: string;
  description: string | null;
  category: ControlCategory | null;
  control_type: ControlType | null;
  frequency: ControlFrequency | null;
  owner_id: string | null;
  owner?: User;
  effectiveness: ControlEffectiveness;
  last_tested: string | null;
  created_at: string;
  updated_at: string;
}

// Finding Types
export type FindingSeverity = 'low' | 'medium' | 'high' | 'critical';
export type FindingStatus = 'draft' | 'open' | 'in_progress' | 'remediated' | 'closed' | 'accepted';

export interface Finding {
  id: string;
  finding_id: string;
  title: string;
  description: string | null;
  audit_id: string | null;
  audit?: Audit;
  risk_id: string | null;
  risk?: Risk;
  control_id: string | null;
  control?: Control;
  severity: FindingSeverity;
  status: FindingStatus;
  root_cause: string | null;
  recommendation: string | null;
  management_response: string | null;
  remediation_date: string | null;
  owner_id: string | null;
  owner?: User;
  identified_by: string | null;
  identified_date: string;
  created_at: string;
  updated_at: string;
}

// Workpaper Types
export type ReviewStatus = 'pending' | 'reviewed' | 'approved' | 'rejected';

export interface Workpaper {
  id: string;
  title: string;
  description: string | null;
  audit_id: string;
  audit?: Audit;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  uploaded_by: string | null;
  uploader?: User;
  review_status: ReviewStatus;
  reviewed_by: string | null;
  reviewer?: User;
  reviewed_at: string | null;
  created_at: string;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  user_id: string;
  user?: User;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalAudits: number;
  activeAudits: number;
  openFindings: number;
  criticalRisks: number;
  pendingReviews: number;
  completedThisMonth: number;
}

// Chart Data Types
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TrendData {
  month: string;
  findings: number;
  resolved: number;
}

// Form Types
export interface AuditFormData {
  title: string;
  description: string;
  audit_type: AuditType;
  status: AuditStatus;
  priority: Priority;
  organization_id: string;
  lead_auditor_id: string;
  start_date: string;
  end_date: string;
  budget_hours: number;
}

export interface FindingFormData {
  title: string;
  description: string;
  audit_id: string;
  severity: FindingSeverity;
  status: FindingStatus;
  root_cause: string;
  recommendation: string;
  owner_id: string;
  remediation_date: string;
}

export interface RiskFormData {
  title: string;
  description: string;
  category: RiskCategory;
  likelihood: number;
  impact: number;
  mitigation_plan: string;
  owner_id: string;
  audit_id: string;
  status: RiskStatus;
}
