"use client"

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react"
import { WheelTheme, THEMES } from "@/lib/themes"
import { playSpinSound } from "@/lib/sounds"
import { incrementSpinCount, getSpinCount } from "@/lib/spinCounter"

export interface SpinWheelHandle {
  saveImage: () => void
}

interface SpinWheelProps {
  items: string[]
  onSpinEnd: (winner: string, winnerColor: string) => void
  isSpinning: boolean
  setIsSpinning: (spinning: boolean) => void
  theme: WheelTheme
  onThemeChange: (theme: WheelTheme) => void
  isMuted: boolean
  onMuteToggle: () => void
}

// Module-level flags so they survive component remounts (key changes)
let hasEverSpun = false
let hasWobbled = false

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.min(255, (num >> 16) + amt)
  const G = Math.min(255, ((num >> 8) & 0x00ff) + amt)
  const B = Math.min(255, (num & 0x0000ff) + amt)
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`
}

function safeGetLS(key: string, fallback: string): string {
  if (typeof window === "undefined") return fallback
  try {
    return localStorage.getItem(key) ?? fallback
  } catch {
    return fallback
  }
}

function safeSetLS(key: string, value: string): void {
  try {
    localStorage.setItem(key, value)
  } catch {}
}

const SpinWheel = forwardRef<SpinWheelHandle, SpinWheelProps>(function SpinWheel(
  { items, onSpinEnd, isSpinning, setIsSpinning, theme, onThemeChange, isMuted, onMuteToggle },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotation, setRotation] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const startRotationRef = useRef<number>(0)
  const targetRotationRef = useRef<number>(0)

  // Spin duration (loaded from localStorage after mount)
  const [spinDuration, setSpinDuration] = useState(5)

  // Pointer wobble angle (single animation on first-ever mount)
  const [pointerAngle, setPointerAngle] = useState(0)
  const wobbleRef = useRef<number | null>(null)

  // SPIN button pulse
  const [showPulse, setShowPulse] = useState(false)
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Global spin counter (Firestore)
  const [totalSpins, setTotalSpins] = useState<number | null>(null)

  // Expose saveImage via ref
  useImperativeHandle(ref, () => ({
    saveImage: () => {
      const canvas = canvasRef.current
      if (!canvas) return

      // Create offscreen canvas with white background + watermark
      const offscreen = document.createElement("canvas")
      offscreen.width = canvas.width
      offscreen.height = canvas.height
      const ctx = offscreen.getContext("2d")
      if (!ctx) return

      // White background (prevents transparent PNG)
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, offscreen.width, offscreen.height)

      // Copy the wheel
      ctx.drawImage(canvas, 0, 0)

      // Watermark bottom-right (scaled for device pixel ratio)
      const dpr = window.devicePixelRatio || 1
      ctx.font = `${12 * dpr}px system-ui, sans-serif`
      ctx.fillStyle = "rgba(160, 160, 160, 0.9)"
      ctx.textAlign = "right"
      ctx.textBaseline = "bottom"
      ctx.fillText("wheelspinner.app", offscreen.width - 8 * dpr, offscreen.height - 8 * dpr)

      const dataUrl = offscreen.toDataURL("image/png")
      const a = document.createElement("a")
      a.href = dataUrl
      a.download = `wheel-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
  }))

  // Load localStorage preferences after mount
  useEffect(() => {
    const dur = parseInt(safeGetLS("wheelDuration", "5"))
    setSpinDuration(isNaN(dur) ? 5 : Math.min(10, Math.max(2, dur)))
  }, [])

  // Fetch global spin count on mount
  useEffect(() => {
    getSpinCount().then((count) => {
      if (count > 0) setTotalSpins(count)
    })
  }, [])

  // Pointer wobble — only once, ever
  useEffect(() => {
    if (hasWobbled) return
    hasWobbled = true

    const duration = 600
    const start = performance.now()

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = elapsed / duration
      if (progress >= 1) {
        setPointerAngle(0)
        return
      }
      // One full sine wave: 0 → -3° → 3° → 0°
      const angle = -Math.sin(progress * 2 * Math.PI) * 3
      setPointerAngle(angle)
      wobbleRef.current = requestAnimationFrame(animate)
    }

    wobbleRef.current = requestAnimationFrame(animate)
    return () => {
      if (wobbleRef.current) cancelAnimationFrame(wobbleRef.current)
    }
  }, [])

  // SPIN button pulse after 4s if no spin has happened
  useEffect(() => {
    if (hasEverSpun) return
    pulseTimerRef.current = setTimeout(() => {
      if (!hasEverSpun) setShowPulse(true)
    }, 4000)
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
    }
  }, [])

  // Canvas drawing
  const drawWheel = useCallback(
    (ctx: CanvasRenderingContext2D, currentRotation: number, size: number, wobbleAngle: number) => {
      const centerX = size / 2
      const centerY = size / 2
      const radius = size / 2 - 30

      ctx.clearRect(0, 0, size, size)

      // Outer shadow
      ctx.save()
      ctx.shadowColor = "rgba(0, 0, 0, 0.25)"
      ctx.shadowBlur = 30
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 8
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 12, 0, 2 * Math.PI)
      ctx.fillStyle = theme.rim
      ctx.fill()
      ctx.restore()

      // Outer rim
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 6, 0, 2 * Math.PI)
      ctx.fillStyle = theme.rim
      ctx.fill()

      // Inner highlight ring
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius + 3, 0, 2 * Math.PI)
      ctx.strokeStyle = "#3d3d5c"
      ctx.lineWidth = 3
      ctx.stroke()

      if (items.length === 0) {
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
        ctx.fillStyle = "#f8f9fa"
        ctx.fill()
        ctx.font = "bold 16px system-ui, sans-serif"
        ctx.fillStyle = "#9ca3af"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText("Add items to spin!", centerX, centerY)
      } else {
        const sliceAngle = (2 * Math.PI) / items.length

        items.forEach((item, index) => {
          const startAngle = index * sliceAngle + currentRotation - Math.PI / 2
          const endAngle = startAngle + sliceAngle

          ctx.beginPath()
          ctx.moveTo(centerX, centerY)
          ctx.arc(centerX, centerY, radius, startAngle, endAngle)
          ctx.closePath()

          const segGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
          const baseColor = theme.segments[index % theme.segments.length]
          segGradient.addColorStop(0, lightenColor(baseColor, 30))
          segGradient.addColorStop(0.4, lightenColor(baseColor, 15))
          segGradient.addColorStop(1, baseColor)
          ctx.fillStyle = segGradient
          ctx.fill()

          ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.save()
          ctx.translate(centerX, centerY)
          const textAngle = startAngle + sliceAngle / 2
          ctx.rotate(textAngle)

          const normalizedAngle = ((textAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
          const needsFlip = normalizedAngle > Math.PI / 2 && normalizedAngle < (3 * Math.PI) / 2

          const textRadius = radius * 0.65
          ctx.font = "600 13px system-ui, sans-serif"
          ctx.fillStyle = theme.textColor
          ctx.shadowColor = "rgba(0, 0, 0, 0.6)"
          ctx.shadowBlur = 1
          ctx.shadowOffsetX = 1
          ctx.shadowOffsetY = 1
          ctx.textBaseline = "middle"

          const maxTextWidth = radius * 0.55
          let displayText = item
          if (ctx.measureText(item).width > maxTextWidth) {
            while (ctx.measureText(displayText + "...").width > maxTextWidth && displayText.length > 0) {
              displayText = displayText.slice(0, -1)
            }
            displayText += "..."
          }

          if (needsFlip) {
            ctx.rotate(Math.PI)
            ctx.textAlign = "center"
            ctx.fillText(displayText, -textRadius, 0)
          } else {
            ctx.textAlign = "center"
            ctx.fillText(displayText, textRadius, 0)
          }
          ctx.restore()
        })
      }

      // Center pin
      const centerColor = theme.center
      const goldGradient = ctx.createRadialGradient(centerX - 8, centerY - 8, 0, centerX, centerY, 28)
      goldGradient.addColorStop(0, lightenColor(centerColor, 30))
      goldGradient.addColorStop(0.3, lightenColor(centerColor, 15))
      goldGradient.addColorStop(0.6, centerColor)
      goldGradient.addColorStop(1, centerColor)

      ctx.beginPath()
      ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI)
      ctx.fillStyle = goldGradient
      ctx.fill()
      ctx.strokeStyle = "#8b6914"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(centerX - 5, centerY - 5, 8, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)"
      ctx.fill()

      // Draw pointer (inline, with wobble)
      const pointerWidth = 28
      const pointerHeight = 36
      const tipY = size / 2 - radius - 6
      const baseY = tipY - pointerHeight

      ctx.save()
      if (wobbleAngle !== 0) {
        const pivotX = centerX
        const pivotY = (tipY + baseY) / 2
        ctx.translate(pivotX, pivotY)
        ctx.rotate((wobbleAngle * Math.PI) / 180)
        ctx.translate(-pivotX, -pivotY)
      }

      ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetY = 4

      ctx.beginPath()
      ctx.moveTo(centerX, tipY)
      ctx.bezierCurveTo(
        centerX - pointerWidth / 4, tipY - pointerHeight * 0.3,
        centerX - pointerWidth / 2, tipY - pointerHeight * 0.5,
        centerX - pointerWidth / 2, baseY + pointerWidth / 2
      )
      ctx.arc(centerX, baseY + pointerWidth / 2, pointerWidth / 2, Math.PI, 0, false)
      ctx.bezierCurveTo(
        centerX + pointerWidth / 2, tipY - pointerHeight * 0.5,
        centerX + pointerWidth / 4, tipY - pointerHeight * 0.3,
        centerX, tipY
      )
      ctx.closePath()

      const pointerGradient = ctx.createLinearGradient(
        centerX - pointerWidth / 2, baseY,
        centerX + pointerWidth / 2, tipY
      )
      pointerGradient.addColorStop(0, "#ff5252")
      pointerGradient.addColorStop(0.5, "#ff3b3b")
      pointerGradient.addColorStop(1, "#d32f2f")
      ctx.fillStyle = pointerGradient
      ctx.fill()

      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(centerX, baseY + pointerWidth / 2, 6, 0, 2 * Math.PI)
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)"
      ctx.fill()

      ctx.restore()
    },
    [items, theme]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const size = 420
    canvas.width = size * dpr
    canvas.height = size * dpr
    ctx.scale(dpr, dpr)

    drawWheel(ctx, rotation, size, pointerAngle)
  }, [rotation, items, drawWheel, pointerAngle, theme])

  const spin = useCallback(() => {
    if (isSpinning || items.length === 0) return

    // Kill pulse, mark spun
    setShowPulse(false)
    hasEverSpun = true

    // Increment global counter (fire-and-forget)
    incrementSpinCount().then(() => {
      setTotalSpins((prev) => (prev !== null ? prev + 1 : null))
    })

    setIsSpinning(true)

    if (!isMuted) {
      playSpinSound(spinDuration)
    }

    const fullRotations = 5 + Math.random() * 3
    const randomOffset = Math.random() * 2 * Math.PI
    const totalRotation = fullRotations * 2 * Math.PI + randomOffset

    startRotationRef.current = rotation
    targetRotationRef.current = rotation + totalRotation
    startTimeRef.current = performance.now()

    const durationMs = spinDuration * 1000

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const progress = Math.min(elapsed / durationMs, 1)
      const easeOut = 1 - Math.pow(1 - progress, 4)
      const currentRotation =
        startRotationRef.current + (targetRotationRef.current - startRotationRef.current) * easeOut
      setRotation(currentRotation)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        setIsSpinning(false)
        const normalizedRotation = currentRotation % (2 * Math.PI)
        const sliceAngle = (2 * Math.PI) / items.length
        const winningIndex =
          Math.floor((2 * Math.PI - normalizedRotation + sliceAngle / 2) / sliceAngle) % items.length
        const winnerColor = theme.segments[winningIndex % theme.segments.length]
        onSpinEnd(items[winningIndex], winnerColor)
      }
    }

    animationRef.current = requestAnimationFrame(animate)
  }, [isSpinning, items, rotation, onSpinEnd, setIsSpinning, isMuted, spinDuration, theme])

  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const handleSpinDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value)
    setSpinDuration(val)
    safeSetLS("wheelDuration", String(val))
  }

  const durationFillPct = ((spinDuration - 2) / (10 - 2)) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas container with mute button */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[420px] lg:h-[420px]"
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <button
          onClick={onMuteToggle}
          title={isMuted ? "Unmute" : "Mute"}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            width: "32px",
            height: "32px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            lineHeight: 1,
          }}
        >
          {isMuted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* Segment count + probability */}
      {items.length > 0 && (
        <p style={{ fontSize: "13px", color: "#888", margin: 0, textAlign: "center" }}>
          {items.length} items · {(100 / items.length).toFixed(1)}% chance each
        </p>
      )}

      {/* Global spin counter */}
      {totalSpins !== null && (
        <p style={{ fontSize: "12px", color: "#bbb", margin: 0, textAlign: "center" }}>
          Spun {totalSpins.toLocaleString()} times
        </p>
      )}

      {/* Theme selector */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {THEMES.map((t) => {
          const isActive = t.id === theme.id
          return (
            <button
              key={t.id}
              title={t.name}
              onClick={() => {
                onThemeChange(t)
                safeSetLS("wheelTheme", t.id)
              }}
              style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: t.segments[0],
                border: isActive ? "2px solid white" : "2px solid transparent",
                boxShadow: isActive
                  ? "0 0 0 2px #6C5CE7"
                  : "0 0 0 1px rgba(0,0,0,0.15)",
                cursor: "pointer",
                padding: 0,
                transition: "box-shadow 0.15s",
                flexShrink: 0,
              }}
            />
          )
        })}
      </div>

      {/* Spin duration */}
      <div style={{ width: "220px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "12px", color: "#888" }}>Spin duration</span>
          <span style={{ fontSize: "12px", color: "#888" }}>{spinDuration}s</span>
        </div>
        <input
          type="range"
          min={2}
          max={10}
          step={1}
          value={spinDuration}
          onChange={handleSpinDurationChange}
          className="spin-duration-slider"
          style={{
            background: `linear-gradient(to right, #6C5CE7 0%, #6C5CE7 ${durationFillPct}%, #e0e0e0 ${durationFillPct}%, #e0e0e0 100%)`,
          }}
        />
      </div>

      {/* SPIN button */}
      <button
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className={[
          "flex items-center justify-center gap-2 text-lg font-bold text-white rounded-full transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95",
          showPulse && !isSpinning && items.length > 0 ? "spin-btn-pulse" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          width: "220px",
          height: "56px",
          background: isSpinning
            ? "linear-gradient(90deg, #6b7280 0%, #4b5563 100%)"
            : "linear-gradient(90deg, #6C5CE7 0%, #a855f7 100%)",
          boxShadow: isSpinning
            ? "0 8px 24px rgba(107, 114, 128, 0.3)"
            : "0 8px 24px rgba(108, 92, 231, 0.4)",
        }}
        onMouseEnter={(e) => {
          if (!isSpinning && items.length > 0) {
            e.currentTarget.style.boxShadow = "0 12px 32px rgba(108, 92, 231, 0.5)"
          }
        }}
        onMouseLeave={(e) => {
          if (!isSpinning && items.length > 0) {
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(108, 92, 231, 0.4)"
          }
        }}
      >
        {isSpinning ? (
          "Spinning..."
        ) : (
          <>
            <span style={{ fontSize: "20px" }}>&#x27F3;</span>
            SPIN
          </>
        )}
      </button>
    </div>
  )
})

export default SpinWheel
