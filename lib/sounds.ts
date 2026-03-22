let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      audioCtx = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      )()
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume()
    }
    return audioCtx
  } catch {
    return null
  }
}

export function playSpinSound(duration: number): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const startTime = ctx.currentTime
  const endTime = startTime + duration
  let t = startTime

  while (t < endTime) {
    const progress = (t - startTime) / duration
    const intervalSec = (80 + (400 - 80) * progress) / 1000
    const tickEnd = t + 0.02
    if (tickEnd >= endTime) break

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'square'
    osc.frequency.value = 300
    gain.gain.setValueAtTime(0.15, t)
    gain.gain.setValueAtTime(0, tickEnd)
    osc.start(t)
    osc.stop(tickEnd + 0.001)

    t += intervalSec
  }
}

export function playWinSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const notes = [523, 659, 784]
  const noteDuration = 0.15
  const gap = 0.05

  notes.forEach((freq, i) => {
    const start = ctx.currentTime + i * (noteDuration + gap)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.3, start)
    gain.gain.exponentialRampToValueAtTime(0.001, start + noteDuration)
    osc.start(start)
    osc.stop(start + noteDuration + 0.001)
  })
}
