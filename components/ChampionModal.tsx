"use client"

import { useEffect, useRef } from "react"
import confetti from "canvas-confetti"

interface ChampionModalProps {
  winner: string
  roundsPlayed: number
  onPlayAgain: () => void
  onClose: () => void
}

export default function ChampionModal({ winner, roundsPlayed, onPlayAgain, onClose }: ChampionModalProps) {
  const hasConfettiFired = useRef(false)
  const modalRef = useRef<HTMLDivElement>(null)

  // Fire champion confetti bursts on mount
  useEffect(() => {
    if (hasConfettiFired.current) return
    hasConfettiFired.current = true

    confetti({
      particleCount: 300,
      spread: 120,
      origin: { y: 0.4 },
      colors: ["#f9ca24", "#f0932b", "#ffdd59", "#ffffff", "#6C5CE7"],
    })

    const timer = setTimeout(() => {
      confetti({
        particleCount: 150,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.6 },
        colors: ["#f9ca24", "#ffffff"],
      })
      confetti({
        particleCount: 150,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.6 },
        colors: ["#f9ca24", "#ffffff"],
      })
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "championFadeIn 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes championFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes championZoom {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      <div
        ref={modalRef}
        style={{
          background: "white",
          borderRadius: "24px",
          padding: "48px",
          textAlign: "center",
          maxWidth: "420px",
          width: "calc(100% - 32px)",
          animation: "championZoom 0.4s ease-out",
        }}
      >
        {/* Trophy */}
        <div style={{ fontSize: "80px", lineHeight: 1, marginBottom: "8px" }}>🏆</div>

        {/* Heading */}
        <h2 style={{ fontSize: "32px", fontWeight: 700, color: "#2d3436", margin: "0 0 0 0" }}>
          Champion!
        </h2>

        {/* Winner name */}
        <p
          style={{
            fontSize: "56px",
            fontWeight: 800,
            color: "#6C5CE7",
            margin: "16px 0",
            lineHeight: 1.1,
            wordBreak: "break-word",
          }}
        >
          {winner}
        </p>

        {/* Subtext */}
        <p style={{ fontSize: "16px", color: "#888", margin: 0 }}>Last one standing!</p>

        {/* Divider */}
        <div style={{ height: "1px", background: "#f0f0f0", margin: "24px 0" }} />

        {/* Stats */}
        <p style={{ fontSize: "14px", color: "#aaa", margin: "0 0 24px 0" }}>
          {roundsPlayed} rounds played
        </p>

        {/* Play Again button */}
        <button
          onClick={onPlayAgain}
          style={{
            width: "100%",
            height: "52px",
            background: "linear-gradient(90deg, #6C5CE7 0%, #a855f7 100%)",
            color: "white",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9" }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "1" }}
        >
          Play Again
        </button>
      </div>
    </div>
  )
}
