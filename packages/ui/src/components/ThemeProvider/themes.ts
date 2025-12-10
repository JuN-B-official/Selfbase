export interface Theme {
  name: string
  value: string
}

export const themes = [
  { name: 'System', value: 'system' }, // Switches between dark and light
  { name: 'Dark', value: 'dark' }, // Classic Selfbase dark
  { name: 'Classic dark', value: 'classic-dark' }, // Deep Dark Selfbase dark
  { name: 'Light', value: 'light' }, // Classic Selfbase light
]
