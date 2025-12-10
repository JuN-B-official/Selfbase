'use client'

import React, { useMemo } from 'react'
import { cn, Separator, CodeBlock } from 'ui'

export interface McpConfigPanelProps {
  basePath: string
  projectRef?: string
  onCopyCallback?: () => void
  theme?: 'light' | 'dark'
  className?: string
  isPlatform: boolean
  apiUrl?: string
  serviceKey?: string
}

// Selfbase: Generate MCP config with actual values
function getSelfbaseMcpConfig(apiUrl: string, serviceKey: string) {
  return {
    mcpServers: {
      'selfbase-mcp': {
        command: 'npx',
        args: [
          '-y',
          '@jun-b/selfbase-mcp@latest',
          '--selfbase-url',
          apiUrl || 'YOUR_SELFBASE_URL',
          '--service-role-key',
          serviceKey || 'YOUR_SERVICE_ROLE_KEY',
        ],
        env: {},
      },
    },
  }
}

export function McpConfigPanel({
  className,
  apiUrl,
  serviceKey,
  onCopyCallback,
}: McpConfigPanelProps) {
  // Generate config with dynamic values
  const clientConfig = useMemo(() => {
    return getSelfbaseMcpConfig(apiUrl || '', serviceKey || '')
  }, [apiUrl, serviceKey])

  const configString = JSON.stringify(clientConfig, null, 2)

  const innerPanelSpacing = 'px-4 py-3'

  return (
    <div className={cn('space-y-4', className)}>
      <div>
        <p className="text-sm text-foreground-light mb-3">
          Add the following configuration to your MCP client (Cursor, Claude Code, VS Code, etc.)
        </p>
      </div>

      {/* Configuration */}
      <div className={cn('border rounded-lg')}>
        <div className={innerPanelSpacing}>
          <h3>Configuration</h3>
        </div>
        <Separator />
        <div className={innerPanelSpacing}>
          <CodeBlock
            language="json"
            hideLineNumbers
            className="max-h-80 overflow-y-auto"
            onCopyCallback={onCopyCallback}
          >
            {configString}
          </CodeBlock>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-foreground-lighter space-y-2">
        <p>
          <strong>File locations:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Cursor: <code>.cursor/mcp.json</code></li>
          <li>Claude Code: <code>.mcp.json</code></li>
          <li>VS Code: <code>.vscode/mcp.json</code></li>
          <li>Antigravity: <code>~/.gemini/antigravity/mcp_config.json</code></li>
        </ul>
      </div>
    </div>
  )
}
