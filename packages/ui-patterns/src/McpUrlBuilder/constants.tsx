import { CodeBlock } from 'ui/src/components/CodeBlock'
import type {
  ClaudeCodeMcpConfig,
  CodexMcpConfig,
  FactoryMcpConfig,
  GooseMcpConfig,
  McpClient,
  McpFeatureGroup,
  VSCodeMcpConfig,
  WindsurfMcpConfig,
} from './types'
import { getMcpUrl } from './types'

// Selfbase MCP Feature Groups
export const FEATURE_GROUPS_PLATFORM: McpFeatureGroup[] = [
  {
    id: 'docs',
    name: 'Documentation',
    description: 'Search Selfbase official documentation',
  },
  {
    id: 'database',
    name: 'Database',
    description: 'Query and manage database schema and data',
  },
  {
    id: 'debugging',
    name: 'Debugging',
    description: 'Get logs and debug issues',
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Get project URL, keys, generate TypeScript types',
  },
  {
    id: 'functions',
    name: 'Functions',
    description: 'Manage and deploy Edge Functions',
  },
  {
    id: 'branching',
    name: 'Branching',
    description: 'Manage database branches (schema-based)',
  },
  {
    id: 'storage',
    name: 'Storage',
    description: 'Manage files and storage buckets',
  },
  {
    id: 'auth',
    name: 'Auth',
    description: 'Manage users and authentication',
  },
  {
    id: 'operations',
    name: 'Operations (SRE)',
    description: 'Health checks, backups, secret rotation',
  },
]

export const FEATURE_GROUPS_NON_PLATFORM = FEATURE_GROUPS_PLATFORM.filter((group) =>
  ['docs', 'database', 'development', 'debugging'].includes(group.id)
)

// Selfbase MCP - Standard config using CLI args (recommended for all clients)
const getSelfbaseMcpConfig = () => ({
  mcpServers: {
    'selfbase-mcp': {
      command: 'npx',
      args: [
        '-y',
        '@jun-b/selfbase-mcp@latest',
        '--selfbase-url',
        'YOUR_SELFBASE_URL',
        '--service-role-key',
        'YOUR_SERVICE_ROLE_KEY',
      ],
      env: {},
    },
  },
})

// Selfbase MCP Clients Configuration
export const MCP_CLIENTS: McpClient[] = [
  {
    key: 'cursor',
    label: 'Cursor',
    icon: 'cursor',
    configFile: '.cursor/mcp.json',
    externalDocsUrl: 'https://docs.cursor.com/context/mcp',
    transformConfig: () => getSelfbaseMcpConfig(),
  },
  {
    key: 'claude-code',
    label: 'Claude Code',
    icon: 'claude',
    configFile: '.mcp.json',
    externalDocsUrl: 'https://code.claude.com/docs/en/mcp',
    transformConfig: () => getSelfbaseMcpConfig(),
    primaryInstructions: (_config, onCopy) => {
      const command = `npx -y @jun-b/selfbase-mcp@latest --selfbase-url YOUR_SELFBASE_URL --service-role-key YOUR_SERVICE_ROLE_KEY`
      return (
        <div className="space-y-2">
          <p className="text-xs text-foreground-light">
            Run the Selfbase MCP server:
          </p>
          <CodeBlock
            value={command}
            language="bash"
            focusable={false}
            className="block"
            onCopyCallback={() => onCopy('command')}
          />
        </div>
      )
    },
  },
  {
    key: 'vscode',
    label: 'VS Code',
    icon: 'vscode',
    configFile: '.vscode/mcp.json',
    externalDocsUrl: 'https://code.visualstudio.com/docs/copilot/chat/mcp-servers',
    transformConfig: (): VSCodeMcpConfig => ({
      servers: {
        'selfbase-mcp': {
          command: 'npx',
          args: [
            '-y',
            '@jun-b/selfbase-mcp@latest',
            '--selfbase-url',
            'YOUR_SELFBASE_URL',
            '--service-role-key',
            'YOUR_SERVICE_ROLE_KEY',
          ],
        },
      },
    }),
  },
  {
    key: 'windsurf',
    label: 'Windsurf',
    icon: 'windsurf',
    configFile: '~/.codeium/windsurf/mcp_config.json',
    externalDocsUrl: '',
    transformConfig: () => getSelfbaseMcpConfig(),
  },
  {
    key: 'goose',
    label: 'Goose',
    icon: 'goose',
    configFile: '~/.config/goose/config.yaml',
    externalDocsUrl: 'https://block.github.io/goose/docs/category/getting-started',
    transformConfig: (): GooseMcpConfig => ({
      extensions: {
        'selfbase-mcp': {
          available_tools: [],
          bundled: null,
          description:
            'Connect your self-hosted Selfbase instance to AI assistants. Manage tables, query data, deploy Edge Functions, and perform SRE operations.',
          enabled: true,
          env_keys: [],
          envs: {},
          headers: {},
          name: 'Selfbase',
          timeout: 300,
          type: 'stdio',
          cmd: 'npx',
          args: [
            '-y',
            '@jun-b/selfbase-mcp@latest',
            '--selfbase-url',
            'YOUR_SELFBASE_URL',
            '--service-role-key',
            'YOUR_SERVICE_ROLE_KEY',
          ],
        },
      },
    }),
    primaryInstructions: (_config, onCopy) => {
      const command = `npx -y @jun-b/selfbase-mcp@latest --selfbase-url YOUR_SELFBASE_URL --service-role-key YOUR_SERVICE_ROLE_KEY`
      return (
        <div className="space-y-2">
          <p className="text-xs text-foreground-light">
            Start with Selfbase MCP:
          </p>
          <CodeBlock
            value={command}
            language="bash"
            focusable={false}
            className="block"
            onCopyCallback={() => onCopy('command')}
          />
        </div>
      )
    },
  },
  {
    key: 'antigravity',
    label: 'Antigravity',
    icon: 'gemini',
    configFile: '~/.gemini/antigravity/mcp_config.json',
    externalDocsUrl: '',
    transformConfig: () => getSelfbaseMcpConfig(),
    primaryInstructions: (_config, onCopy) => (
      <div className="space-y-2">
        <p className="text-xs text-foreground-light">
          For Antigravity IDE, use CLI arguments (env vars cause EOF errors):
        </p>
        <CodeBlock
          value={JSON.stringify(getSelfbaseMcpConfig(), null, 2)}
          language="json"
          focusable={false}
          className="block"
          onCopyCallback={() => onCopy('config')}
        />
      </div>
    ),
  },
]

// Selfbase MCP URL defaults
export const DEFAULT_MCP_URL_PLATFORM = '/api/mcp'
export const DEFAULT_MCP_URL_NON_PLATFORM = 'http://localhost:54321/mcp'
