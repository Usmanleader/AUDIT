# AuditPro - Enterprise Audit Management Software

## Complete Setup Guide for Production Deployment

---

## 📁 Project Folder Structure

```
audit-pro/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx          # Main navigation sidebar
│   │   │   ├── Header.tsx           # Top header with user info
│   │   │   └── Layout.tsx           # Main layout wrapper
│   │   ├── ui/
│   │   │   ├── Button.tsx           # Reusable button component
│   │   │   ├── Card.tsx             # Card component
│   │   │   ├── Input.tsx            # Form input component
│   │   │   ├── Modal.tsx            # Modal dialog component
│   │   │   ├── Badge.tsx            # Status badge component
│   │   │   ├── Table.tsx            # Data table component
│   │   │   └── Select.tsx           # Dropdown select component
│   │   ├── dashboard/
│   │   │   ├── StatsCard.tsx        # Statistics cards
│   │   │   ├── AuditChart.tsx       # Charts for analytics
│   │   │   └── RecentActivity.tsx   # Recent activities list
│   │   ├── audits/
│   │   │   ├── AuditList.tsx        # List all audits
│   │   │   ├── AuditForm.tsx        # Create/Edit audit form
│   │   │   ├── AuditDetails.tsx     # Audit detail view
│   │   │   └── AuditTimeline.tsx    # Audit progress timeline
│   │   ├── findings/
│   │   │   ├── FindingsList.tsx     # List all findings
│   │   │   ├── FindingForm.tsx      # Create/Edit finding
│   │   │   └── FindingCard.tsx      # Finding summary card
│   │   ├── risks/
│   │   │   ├── RiskMatrix.tsx       # Risk assessment matrix
│   │   │   ├── RiskList.tsx         # Risk register list
│   │   │   └── RiskForm.tsx         # Risk entry form
│   │   ├── controls/
│   │   │   ├── ControlsList.tsx     # Controls library
│   │   │   └── ControlForm.tsx      # Control entry form
│   │   ├── reports/
│   │   │   ├── ReportBuilder.tsx    # Report generation
│   │   │   └── ReportTemplates.tsx  # Report templates
│   │   └── workpapers/
│   │       ├── WorkpaperList.tsx    # Workpapers list
│   │       └── WorkpaperUpload.tsx  # File upload component
│   ├── pages/
│   │   ├── Dashboard.tsx            # Main dashboard page
│   │   ├── Audits.tsx               # Audits management page
│   │   ├── Findings.tsx             # Findings page
│   │   ├── Risks.tsx                # Risk management page
│   │   ├── Controls.tsx             # Controls page
│   │   ├── Reports.tsx              # Reports page
│   │   ├── Settings.tsx             # Settings page
│   │   └── Login.tsx                # Authentication page
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client configuration
│   │   └── utils.ts                 # Utility functions
│   ├── store/
│   │   ├── authStore.ts             # Authentication state
│   │   ├── auditStore.ts            # Audit state management
│   │   └── uiStore.ts               # UI state (sidebar, modals)
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── useAudits.ts             # Audits data hook
│   │   └── useSupabase.ts           # Supabase operations hook
│   ├── App.tsx                       # Main application component
│   ├── main.tsx                      # Application entry point
│   └── index.css                     # Global styles
├── .env.local                        # Environment variables (local)
├── .env.example                      # Environment template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── vite.config.ts                    # Vite configuration
└── README.md                         # Project documentation
```

---

## 🗄️ Supabase Database Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - **Name**: audit-pro
   - **Database Password**: (generate a strong password)
   - **Region**: Choose closest to your users
5. Wait for project to be created (~2 minutes)

### Step 2: Get Your Credentials

After project creation, go to **Settings > API** and note:

```
VITE_SUPABASE_URL=https://nmggvkhbogddynqcovpl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ2d2a2hib2dkZHlucWNvdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODgwMTIsImV4cCI6MjA4NjU2NDAxMn0.tTLtI7rPlSdmRglY6iOenwaKycwSSV0fjv_zgHcX1C0
```

### Step 3: Create Database Tables

Go to **SQL Editor** and run this schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'auditor' CHECK (role IN ('admin', 'manager', 'auditor', 'viewer')),
    department TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations/Clients table
CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    industry TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Engagements table
CREATE TABLE audits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    audit_type TEXT NOT NULL CHECK (audit_type IN ('internal', 'external', 'compliance', 'operational', 'financial', 'it', 'sox')),
    status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'fieldwork', 'review', 'reporting', 'completed', 'on_hold')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    organization_id UUID REFERENCES organizations(id),
    lead_auditor_id UUID REFERENCES profiles(id),
    start_date DATE,
    end_date DATE,
    budget_hours NUMERIC(10,2),
    actual_hours NUMERIC(10,2) DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Team Members
CREATE TABLE audit_team (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    role TEXT DEFAULT 'team_member' CHECK (role IN ('lead', 'senior', 'team_member', 'reviewer')),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Register
CREATE TABLE risks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('strategic', 'operational', 'financial', 'compliance', 'technology', 'reputational')),
    likelihood INTEGER CHECK (likelihood BETWEEN 1 AND 5),
    impact INTEGER CHECK (impact BETWEEN 1 AND 5),
    risk_score INTEGER GENERATED ALWAYS AS (likelihood * impact) STORED,
    risk_level TEXT GENERATED ALWAYS AS (
        CASE 
            WHEN likelihood * impact >= 20 THEN 'critical'
            WHEN likelihood * impact >= 12 THEN 'high'
            WHEN likelihood * impact >= 6 THEN 'medium'
            ELSE 'low'
        END
    ) STORED,
    mitigation_plan TEXT,
    owner_id UUID REFERENCES profiles(id),
    audit_id UUID REFERENCES audits(id),
    status TEXT DEFAULT 'identified' CHECK (status IN ('identified', 'assessed', 'mitigating', 'accepted', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Controls Library
CREATE TABLE controls (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    control_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('preventive', 'detective', 'corrective', 'directive')),
    control_type TEXT CHECK (control_type IN ('manual', 'automated', 'it_dependent')),
    frequency TEXT CHECK (frequency IN ('continuous', 'daily', 'weekly', 'monthly', 'quarterly', 'annually')),
    owner_id UUID REFERENCES profiles(id),
    effectiveness TEXT DEFAULT 'not_tested' CHECK (effectiveness IN ('not_tested', 'effective', 'partially_effective', 'ineffective')),
    last_tested DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Control Testing
CREATE TABLE control_tests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    control_id UUID REFERENCES controls(id) ON DELETE CASCADE,
    audit_id UUID REFERENCES audits(id),
    test_date DATE NOT NULL,
    tester_id UUID REFERENCES profiles(id),
    sample_size INTEGER,
    exceptions_found INTEGER DEFAULT 0,
    result TEXT CHECK (result IN ('passed', 'failed', 'inconclusive')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Findings/Issues
CREATE TABLE findings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    finding_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    audit_id UUID REFERENCES audits(id),
    risk_id UUID REFERENCES risks(id),
    control_id UUID REFERENCES controls(id),
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'in_progress', 'remediated', 'closed', 'accepted')),
    root_cause TEXT,
    recommendation TEXT,
    management_response TEXT,
    remediation_date DATE,
    owner_id UUID REFERENCES profiles(id),
    identified_by UUID REFERENCES profiles(id),
    identified_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workpapers/Documents
CREATE TABLE workpapers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
    file_url TEXT,
    file_name TEXT,
    file_type TEXT,
    file_size INTEGER,
    uploaded_by UUID REFERENCES profiles(id),
    review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'reviewed', 'approved', 'rejected')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit Comments/Notes
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    entity_type TEXT NOT NULL CHECK (entity_type IN ('audit', 'finding', 'risk', 'control', 'workpaper')),
    entity_id UUID NOT NULL,
    author_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity Log
CREATE TABLE activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Templates
CREATE TABLE report_templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    template_type TEXT CHECK (template_type IN ('audit_report', 'executive_summary', 'finding_report', 'risk_assessment')),
    content JSONB,
    created_by UUID REFERENCES profiles(id),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_audits_status ON audits(status);
CREATE INDEX idx_audits_organization ON audits(organization_id);
CREATE INDEX idx_findings_audit ON findings(audit_id);
CREATE INDEX idx_findings_status ON findings(status);
CREATE INDEX idx_risks_audit ON risks(audit_id);
CREATE INDEX idx_controls_effectiveness ON controls(effectiveness);
CREATE INDEX idx_activity_log_user ON activity_log(user_id);
CREATE INDEX idx_activity_log_created ON activity_log(created_at);

-- Row Level Security Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE risks ENABLE ROW LEVEL SECURITY;
ALTER TABLE controls ENABLE ROW LEVEL SECURITY;
ALTER TABLE findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE workpapers ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Policies for audits (all authenticated users can view)
CREATE POLICY "Authenticated users can view audits" ON audits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can insert audits" ON audits FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update audits" ON audits FOR UPDATE USING (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Authenticated users can manage organizations" ON organizations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage risks" ON risks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage controls" ON controls FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage findings" ON findings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can manage workpapers" ON workpapers FOR ALL USING (auth.role() = 'authenticated');

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audits_updated_at BEFORE UPDATE ON audits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_risks_updated_at BEFORE UPDATE ON risks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_controls_updated_at BEFORE UPDATE ON controls FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_findings_updated_at BEFORE UPDATE ON findings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 4: Set Up Storage (for workpapers)

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket called `workpapers`
3. Set it to **Private**
4. Add policy for authenticated uploads:

```sql
CREATE POLICY "Authenticated users can upload workpapers"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'workpapers' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view workpapers"
ON storage.objects FOR SELECT
USING (bucket_id = 'workpapers' AND auth.role() = 'authenticated');
```

---

## 🔐 Environment Variables

### Create `.env.local` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: For server-side operations
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
VITE_APP_NAME=AuditPro
VITE_APP_ENV=development
```

---

## 🚀 Vercel Deployment Guide

### Step 1: Prepare Your Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - AuditPro"
git branch -M main
git remote add origin https://github.com/yourusername/audit-pro.git
git push -u origin main
```

### Step 2: Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select "audit-pro"

### Step 3: Configure Environment Variables

In Vercel project settings, add these environment variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://nmggvkhbogddynqcovpl.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tZ2d2a2hib2dkZHlucWNvdnBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5ODgwMTIsImV4cCI6MjA4NjU2NDAxMn0.tTLtI7rPlSdmRglY6iOenwaKycwSSV0fjv_zgHcX1C0` | Production, Preview, Development |
| `VITE_APP_NAME` | `AuditPro` | All |
| `VITE_APP_ENV` | `production` | Production |

### Step 4: Configure Build Settings

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 5: Deploy

Click "Deploy" and wait for the build to complete.

### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings > Domains**
2. Add your custom domain
3. Configure DNS records as shown
4. Enable HTTPS (automatic)

---

## 🔧 Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/audit-pro.git
cd audit-pro

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

---

## 📊 Features Overview

### 1. **Dashboard**
- Real-time audit statistics
- Risk heat map
- Finding trends chart
- Recent activities feed
- Team workload view

### 2. **Audit Management**
- Create and manage audit engagements
- Assign team members
- Track progress and milestones
- Budget vs actual hours
- Audit calendar view

### 3. **Risk Assessment**
- Risk register with heat map
- Risk scoring (likelihood × impact)
- Risk trends over time
- Mitigation tracking
- Risk-control mapping

### 4. **Controls Testing**
- Controls library
- Test scheduling
- Sample testing
- Exception tracking
- Control effectiveness dashboard

### 5. **Findings Management**
- Issue identification
- Severity classification
- Root cause analysis
- Remediation tracking
- Management response workflow

### 6. **Workpapers**
- Document management
- Version control
- Review workflow
- Secure file storage
- Search and filter

### 7. **Reporting**
- Customizable templates
- Executive summaries
- Detailed audit reports
- Export to PDF/Excel
- Scheduled reports

---

## 🔒 Security Best Practices

1. **Never expose service role key** in frontend code
2. **Use Row Level Security** for all tables
3. **Validate all inputs** on both client and server
4. **Enable MFA** for user accounts
5. **Regular security audits** of the platform
6. **Encrypt sensitive data** at rest
7. **Use HTTPS only** in production

---

## 📞 Support

For issues or questions:
- Create a GitHub issue
- Email: support@auditpro.example.com
- Documentation: https://docs.auditpro.example.com
