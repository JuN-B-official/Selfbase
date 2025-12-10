export const monokaiCustomTheme = (isDarkMode: boolean) => {
  return {
    hljs: {
      display: 'block',
      overflowX: 'auto',
      color: isDarkMode ? '#ddd' : '#444',
    },
    'hljs-tag': {
      color: '#569cd6',
    },
    'hljs-keyword': {
      color: '#569cd6',
      fontWeight: 'normal',
    },
    'hljs-selector-tag': {
      color: '#569cd6',
      fontWeight: 'normal',
    },
    'hljs-literal': {
      color: '#569cd6',
      fontWeight: 'normal',
    },
    'hljs-strong': {
      color: '#569cd6',
    },
    'hljs-name': {
      color: '#569cd6',
    },
    'hljs-code': {
      color: '#66d9ef',
    },
    'hljs-class .hljs-title': {
      color: 'gray',
    },
    'hljs-attribute': {
      color: '#bf79db',
    },
    'hljs-symbol': {
      color: '#bf79db',
    },
    'hljs-regexp': {
      color: '#bf79db',
    },
    'hljs-link': {
      color: '#bf79db',
    },
    'hljs-string': {
      color: '#FC4803',
    },
    'hljs-bullet': {
      color: '#FC4803',
    },
    'hljs-subst': {
      color: '#FC4803',
    },
    'hljs-title': {
      color: '#FC4803',
      fontWeight: 'normal',
    },
    'hljs-section': {
      color: '#FC4803',
      fontWeight: 'normal',
    },
    'hljs-emphasis': {
      color: '#FC4803',
    },
    'hljs-type': {
      color: '#FC4803',
      fontWeight: 'normal',
    },
    'hljs-built_in': {
      color: '#FC4803',
    },
    'hljs-builtin-name': {
      color: '#FC4803',
    },
    'hljs-selector-attr': {
      color: '#FC4803',
    },
    'hljs-selector-pseudo': {
      color: '#FC4803',
    },
    'hljs-addition': {
      color: '#FC4803',
    },
    'hljs-variable': {
      color: '#FC4803',
    },
    'hljs-template-tag': {
      color: '#FC4803',
    },
    'hljs-template-variable': {
      color: '#FC4803',
    },
    'hljs-comment': {
      color: isDarkMode ? '#999' : '#888',
    },
    'hljs-quote': {
      color: '#75715e',
    },
    'hljs-deletion': {
      color: '#75715e',
    },
    'hljs-meta': {
      color: '#75715e',
    },
    'hljs-doctag': {
      fontWeight: 'normal',
    },
    'hljs-selector-id': {
      fontWeight: 'normal',
    },
  }
}
