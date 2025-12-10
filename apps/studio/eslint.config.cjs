const { defineConfig } = require('eslint/config')
const barrelFiles = require('eslint-plugin-barrel-files')
const selfbaseConfig = require('eslint-config-selfbase/next')

module.exports = defineConfig([
  { files: ['**/*.ts', '**/*.tsx'] },
  selfbaseConfig,
  {
    plugins: {
      'barrel-files': barrelFiles,
    },
    rules: {
      '@next/next/no-img-element': 'off',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'warn',
      'barrel-files/avoid-re-export-all': 'error',
    },
  },
])
