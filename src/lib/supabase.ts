import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These values should be set in your .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nmggvkhbogddynqcovpl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ2d2a2hib2dkZHlucWNvdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODgwMTIsImV4cCI6MjA4NjU2NDAxMn0.tTLtI7rPlSdmRglY6iOenwaKycwSSV0fjv_zgHcX1C0';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return (
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseAnonKey !== 'your-anon-key' &&
    supabaseUrl.includes('supabase.co')
  );
};

// Auth helpers
export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Database helpers
export const fetchAudits = async () => {
  const { data, error } = await supabase
    .from('audits')
    .select(`
      *,
      organization:organizations(*),
      lead_auditor:profiles!audits_lead_auditor_id_fkey(*)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const fetchAuditById = async (id: string) => {
  const { data, error } = await supabase
    .from('audits')
    .select(`
      *,
      organization:organizations(*),
      lead_auditor:profiles!audits_lead_auditor_id_fkey(*)
    `)
    .eq('id', id)
    .single();
  return { data, error };
};

export const fetchFindings = async () => {
  const { data, error } = await supabase
    .from('findings')
    .select(`
      *,
      audit:audits(*),
      owner:profiles!findings_owner_id_fkey(*)
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const fetchRisks = async () => {
  const { data, error } = await supabase
    .from('risks')
    .select(`
      *,
      audit:audits(*),
      owner:profiles!risks_owner_id_fkey(*)
    `)
    .order('risk_score', { ascending: false });
  return { data, error };
};

export const fetchControls = async () => {
  const { data, error } = await supabase
    .from('controls')
    .select(`
      *,
      owner:profiles!controls_owner_id_fkey(*)
    `)
    .order('control_id', { ascending: true });
  return { data, error };
};

export const fetchWorkpapers = async (auditId?: string) => {
  let query = supabase
    .from('workpapers')
    .select(`
      *,
      audit:audits(*),
      uploader:profiles!workpapers_uploaded_by_fkey(*)
    `)
    .order('created_at', { ascending: false });
  
  if (auditId) {
    query = query.eq('audit_id', auditId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const fetchProfiles = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('full_name', { ascending: true });
  return { data, error };
};

export const fetchOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
};

// Activity logging
export const logActivity = async (
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>
) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('activity_log').insert({
    user_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    details,
  });
};
