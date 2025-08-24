export function getPalette(theme) {
  if (theme === 'light') {
    return {
      background: '#f8fafc',
      panel: '#ffffff',
      muted: '#f1f5f9',
      border: '#e5e7eb',
      text: '#0f172a',
      subtext: '#475569',
      accent: '#10b981',
      danger: '#ef4444',
      tableHeader: '#f1f5f9',
      inputBg: '#ffffff',
      inputText: '#0f172a',
      icon: '#334155',
      hover: '#e2e8f0',
    }
  }
  return {
    background: '#0f0f0f',
    panel: '#1a1a1a',
    muted: '#262626',
    border: '#2d2d2d',
    text: '#ffffff',
    subtext: '#a3a3a3',
    accent: '#10b981',
    danger: '#ef4444',
    tableHeader: '#262626',
    inputBg: '#262626',
    inputText: '#ffffff',
    icon: '#e5e7eb',
    hover: '#333333',
  }
}
