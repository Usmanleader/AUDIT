import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Audit, Finding, Risk, Control } from '@/types';

interface AuditState {
  // Audits
  audits: Audit[];
  selectedAudit: Audit | null;
  setAudits: (audits: Audit[]) => void;
  setSelectedAudit: (audit: Audit | null) => void;
  addAudit: (audit: Audit) => void;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  removeAudit: (id: string) => void;

  // Findings
  findings: Finding[];
  selectedFinding: Finding | null;
  setFindings: (findings: Finding[]) => void;
  setSelectedFinding: (finding: Finding | null) => void;
  addFinding: (finding: Finding) => void;
  updateFinding: (id: string, updates: Partial<Finding>) => void;
  removeFinding: (id: string) => void;

  // Risks
  risks: Risk[];
  selectedRisk: Risk | null;
  setRisks: (risks: Risk[]) => void;
  setSelectedRisk: (risk: Risk | null) => void;
  addRisk: (risk: Risk) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  removeRisk: (id: string) => void;

  // Controls
  controls: Control[];
  selectedControl: Control | null;
  setControls: (controls: Control[]) => void;
  setSelectedControl: (control: Control | null) => void;
  addControl: (control: Control) => void;
  updateControl: (id: string, updates: Partial<Control>) => void;
  removeControl: (id: string) => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      // Audits
      audits: [],
      selectedAudit: null,
      setAudits: (audits) => set({ audits }),
      setSelectedAudit: (selectedAudit) => set({ selectedAudit }),
      addAudit: (audit) => set((state) => ({ audits: [...state.audits, audit] })),
      updateAudit: (id, updates) =>
        set((state) => ({
          audits: state.audits.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })),
      removeAudit: (id) =>
        set((state) => ({
          audits: state.audits.filter((a) => a.id !== id),
          selectedAudit: state.selectedAudit?.id === id ? null : state.selectedAudit,
        })),

      // Findings
      findings: [],
      selectedFinding: null,
      setFindings: (findings) => set({ findings }),
      setSelectedFinding: (selectedFinding) => set({ selectedFinding }),
      addFinding: (finding) => set((state) => ({ findings: [...state.findings, finding] })),
      updateFinding: (id, updates) =>
        set((state) => ({
          findings: state.findings.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        })),
      removeFinding: (id) =>
        set((state) => ({
          findings: state.findings.filter((f) => f.id !== id),
          selectedFinding: state.selectedFinding?.id === id ? null : state.selectedFinding,
        })),

      // Risks
      risks: [],
      selectedRisk: null,
      setRisks: (risks) => set({ risks }),
      setSelectedRisk: (selectedRisk) => set({ selectedRisk }),
      addRisk: (risk) => set((state) => ({ risks: [...state.risks, risk] })),
      updateRisk: (id, updates) =>
        set((state) => ({
          risks: state.risks.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      removeRisk: (id) =>
        set((state) => ({
          risks: state.risks.filter((r) => r.id !== id),
          selectedRisk: state.selectedRisk?.id === id ? null : state.selectedRisk,
        })),

      // Controls
      controls: [],
      selectedControl: null,
      setControls: (controls) => set({ controls }),
      setSelectedControl: (selectedControl) => set({ selectedControl }),
      addControl: (control) => set((state) => ({ controls: [...state.controls, control] })),
      updateControl: (id, updates) =>
        set((state) => ({
          controls: state.controls.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      removeControl: (id) =>
        set((state) => ({
          controls: state.controls.filter((c) => c.id !== id),
          selectedControl: state.selectedControl?.id === id ? null : state.selectedControl,
        })),
    }),
    {
      name: 'auditpro-data',
    }
  )
);
