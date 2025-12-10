-- Selfbase: Multi-Project Management Schema
-- This schema stores metadata for multiple projects in a single self-hosted instance
-- No default organization/project - users create their own (like Selfbase Cloud)

-- Create selfbase schema
CREATE SCHEMA IF NOT EXISTS selfbase;

-- Organizations table
CREATE TABLE IF NOT EXISTS selfbase.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    billing_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS selfbase.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    schema_name TEXT NOT NULL UNIQUE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'deleted')),
    organization_id UUID REFERENCES selfbase.organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_projects_org_id ON selfbase.projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON selfbase.projects(status);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON selfbase.organizations(slug);

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
    p_org_id UUID,
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
    INSERT INTO selfbase.projects (name, description, schema_name, organization_id)
    VALUES (p_name, p_description, v_schema_name, p_org_id)
    RETURNING id INTO v_project_id;
    
    -- Create project schema
    PERFORM selfbase.create_project_schema(v_schema_name);
    
    RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON SCHEMA selfbase IS 'Selfbase multi-project management schema';
COMMENT ON TABLE selfbase.organizations IS 'Organizations for grouping projects';
COMMENT ON TABLE selfbase.projects IS 'Stores metadata for each project in the self-hosted instance';
