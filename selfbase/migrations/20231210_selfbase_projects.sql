-- Selfbase: Multi-Project Management Schema
-- This schema stores metadata for multiple projects in a single self-hosted instance

-- Create selfbase schema
CREATE SCHEMA IF NOT EXISTS selfbase;

-- Projects table
CREATE TABLE IF NOT EXISTS selfbase.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    schema_name TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
    organization_id UUID NOT NULL DEFAULT '00000000-0000-0000-0000-000000000000',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table (for future multi-org support)
CREATE TABLE IF NOT EXISTS selfbase.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    billing_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default organization
INSERT INTO selfbase.organizations (id, name, slug, billing_email)
VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Default Organization',
    'default',
    'admin@localhost'
) ON CONFLICT (id) DO NOTHING;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON selfbase.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON selfbase.projects(status);

-- Function to create project schema
CREATE OR REPLACE FUNCTION selfbase.create_project_schema(project_schema TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', project_schema);
END;
$$ LANGUAGE plpgsql;

-- Function to initialize new project
CREATE OR REPLACE FUNCTION selfbase.init_project(
    p_name TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_project_id UUID;
    v_schema_name TEXT;
BEGIN
    -- Generate unique schema name
    v_schema_name := 'project_' || replace(gen_random_uuid()::text, '-', '_');
    
    -- Insert project record
    INSERT INTO selfbase.projects (name, description, schema_name)
    VALUES (p_name, p_description, v_schema_name)
    RETURNING id INTO v_project_id;
    
    -- Create project schema
    PERFORM selfbase.create_project_schema(v_schema_name);
    
    RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Comment
COMMENT ON SCHEMA selfbase IS 'Selfbase multi-project management schema';
COMMENT ON TABLE selfbase.projects IS 'Stores metadata for each project in the self-hosted instance';
COMMENT ON TABLE selfbase.organizations IS 'Organizations for grouping projects (future use)';
