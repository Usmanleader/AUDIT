import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Audit, Organization } from '@/types';

export function useAudits() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAudits = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('audits')
        .select(`
          *,
          organization:organizations(*),
          lead_auditor:profiles!audits_lead_auditor_id_fkey(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAudits(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch audits');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (err) {
      console.error('Failed to fetch organizations:', err);
    }
  };

  const createAudit = async (audit: Partial<Audit>) => {
    const { data, error } = await supabase
      .from('audits')
      .insert([audit])
      .select()
      .single();

    if (error) throw error;
    await fetchAudits();
    return data;
  };

  const updateAudit = async (id: string, updates: Partial<Audit>) => {
    const { data, error } = await supabase
      .from('audits')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    await fetchAudits();
    return data;
  };

  const deleteAudit = async (id: string) => {
    const { error } = await supabase.from('audits').delete().eq('id', id);
    if (error) throw error;
    await fetchAudits();
  };

  useEffect(() => {
    fetchAudits();
    fetchOrganizations();
  }, []);

  return {
    audits,
    organizations,
    isLoading,
    error,
    refetch: fetchAudits,
    createAudit,
    updateAudit,
    deleteAudit,
  };
}
