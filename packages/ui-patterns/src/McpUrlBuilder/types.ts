// Selfbase MCP Type Definitions

export interface McpFeatureGroup {
  id: string
  name: string
  description: string
}

export type McpOnCopyCallback = 'url' | 'config' | 'command'

export interface McpClient {
  key: string
  label: string
  icon?: string
  docsUrl?: string
  externalDocsUrl?: string
  configFile?: string
  generateDeepLink?: (config: McpClientConfig) => string | null
  transformConfig?: (config: McpClientBaseConfig) => McpClientConfig
  primaryInstructions?: (
    config: McpClientConfig,
    onCopy: (type?: McpOnCopyCallback) => void
  ) => React.ReactNode
  alternateInstructions?: (
    config: McpClientConfig,
    onCopy: (type?: McpOnCopyCallback) => void
  ) => React.ReactNode
}

export interface McpUrlBuilderConfig {
  projectRef: string
  readonly?: boolean
  features?: string[]
}

// Base config with flexible server name
export interface McpClientBaseConfig {
  mcpServers: {
    [key: string]: {
      url?: string
      command?: string
      args?: string[]
      env?: Record<string, string>
    }
  }
}

export interface CursorMcpConfig extends McpClientBaseConfig { }

export interface VSCodeMcpConfig {
  servers: {
    [key: string]: {
      type?: string
      url?: string
      command?: string
      args?: string[]
      env?: Record<string, string>
    }
  }
}

export interface WindsurfMcpConfig {
  mcpServers: {
    [key: string]: {
      command: string
      args: string[]
      env?: Record<string, string>
    }
  }
}

export interface ClaudeCodeMcpConfig {
  mcpServers: {
    [key: string]: {
      type?: string
      url?: string
      command?: string
      args?: string[]
      env?: Record<string, string>
    }
  }
}

export interface ClaudeDesktopMcpConfig {
  mcpServers: {
    [key: string]: {
      type?: string
      url?: string
      command?: string
      args?: string[]
      env?: Record<string, string>
    }
  }
}

export interface OtherMcpConfig {
  mcpServers: {
    [key: string]: {
      type?: string
      url?: string
      command?: string
      args?: string[]
      env?: Record<string, string>
    }
  }
}

export interface GooseMcpConfig {
  extensions: {
    [key: string]: {
      available_tools: string[]
      bundled: null
      description: string
      enabled: boolean
      env_keys: string[]
      envs: Record<string, string>
      headers: Record<string, string>
      name: string
      timeout: number
      type: string
      uri?: string
      cmd?: string
      args?: string[]
    }
  }
}

export interface FactoryMcpConfig {
  mcpServers: {
    [key: string]: {
      type?: string
      url?: string
      command?: string
      args?: string[]
      env?: Record<string, string>
    }
  }
}

export interface CodexMcpConfig {
  mcp_servers: {
    [key: string]: {
      url: string
    }
  }
}

// Union of all possible config types
export type McpClientConfig =
  | ClaudeCodeMcpConfig
  | ClaudeDesktopMcpConfig
  | CodexMcpConfig
  | CursorMcpConfig
  | FactoryMcpConfig
  | GooseMcpConfig
  | McpClientBaseConfig
  | OtherMcpConfig
  | VSCodeMcpConfig
  | WindsurfMcpConfig

// Type guards
export function isVSCodeMcpConfig(config: McpClientConfig): config is VSCodeMcpConfig {
  return 'servers' in config
}

export function isGooseMcpConfig(config: McpClientConfig): config is GooseMcpConfig {
  return 'extensions' in config
}

export function isCodexMcpConfig(config: McpClientConfig): config is CodexMcpConfig {
  return 'mcp_servers' in config
}

export function isMcpServersConfig(
  config: McpClientConfig
): config is McpClientBaseConfig | ClaudeCodeMcpConfig | FactoryMcpConfig {
  return 'mcpServers' in config
}

// Helper to extract MCP URL from any config type
export function getMcpUrl(config: McpClientConfig): string {
  if (isVSCodeMcpConfig(config)) {
    const serverName = Object.keys(config.servers)[0]
    return config.servers[serverName]?.url || ''
  }
  if (isGooseMcpConfig(config)) {
    const extName = Object.keys(config.extensions)[0]
    return config.extensions[extName]?.uri || ''
  }
  if (isCodexMcpConfig(config)) {
    const serverName = Object.keys(config.mcp_servers)[0]
    return config.mcp_servers[serverName]?.url || ''
  }
  if (isMcpServersConfig(config)) {
    const serverName = Object.keys(config.mcpServers)[0]
    return config.mcpServers[serverName]?.url || ''
  }
  throw new Error('Invalid MCP config type')
}
