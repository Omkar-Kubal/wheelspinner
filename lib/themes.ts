export interface WheelTheme {
  id: string
  name: string
  segments: string[]
  rim: string
  center: string
  textColor: string
}

export const THEMES: WheelTheme[] = [
  {
    id: 'vibrant',
    name: 'Vibrant',
    segments: ['#FF6B6B','#FF9F43','#FECA57','#48DBFB','#FF9FF3','#54A0FF','#5F27CD','#00D2D3','#1DD1A1','#C8D6E5'],
    rim: '#1a1a2e',
    center: '#f9ca24',
    textColor: '#ffffff',
  },
  {
    id: 'dark',
    name: 'Dark',
    segments: ['#2d3436','#636e72','#b2bec3','#6C5CE7','#fd79a8','#00cec9','#e17055','#74b9ff','#55efc4','#fdcb6e'],
    rim: '#000000',
    center: '#dfe6e9',
    textColor: '#ffffff',
  },
  {
    id: 'pastel',
    name: 'Pastel',
    segments: ['#ffeaa7','#fab1a0','#81ecec','#a29bfe','#fd79a8','#55efc4','#fdcb6e','#e17055','#74b9ff','#00b894'],
    rim: '#b2bec3',
    center: '#ffffff',
    textColor: '#2d3436',
  },
  {
    id: 'fire',
    name: 'Fire',
    segments: ['#d63031','#e17055','#e84393','#fdcb6e','#e67e22','#c0392b','#f39c12','#d35400','#922b21','#f1948a'],
    rim: '#2c0000',
    center: '#f39c12',
    textColor: '#ffffff',
  },
]

export const DEFAULT_THEME = THEMES[0]
