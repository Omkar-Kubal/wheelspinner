"use client"

import { useEffect, useRef } from "react"

interface ResultModalProps {
  winner: string | null
  onClose: () => void
  onSpinAgain?: () => void
  onRemoveAndSpin?: () => void
  isChampion?: boolean
  onStartOver?: () => void
}

export default function ResultModal({
  winner,
  onClose,
  onSpinAgain,
  onRemoveAndSpin,
  isChampion,
  onStartOver,
}: ResultModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  if (!winner) return null

  if (isChampion) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
        <div
          ref={modalRef}
          className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-20 blur-2xl" />
          </div>

          <div className="relative p-8 text-center pt-10">
            <p className="text-5xl mb-3">🏆</p>
            <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
              Champion!
            </p>
            <h2
              className="font-extrabold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent mb-3 break-words pb-1"
              style={{ fontSize: "48px", lineHeight: 1.1 }}
            >
              {winner}
            </h2>
            <p className="text-gray-500 text-sm mb-8">Last one standing!</p>
            <button
              onClick={onStartOver || onClose}
              className="w-full px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #f9ca24 0%, #f0932b 100%)",
              }}
            >
              Start Over
            </button>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 bg-white/50 backdrop-blur"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-300"
      >
        {/* Confetti-like decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-2xl" />
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-20 blur-2xl" />
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full opacity-20 blur-2xl" />
        </div>

        <div className="relative p-8 text-center pt-10">
          {/* Trophy icon */}
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg border-4 border-white">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C9.24 2 7 4.24 7 7h-2c0-1.1-.9-2-2-2s-2 .9-2 2c0 2.76 2.24 5 5 5v2h-1c-.55 0-1 .45-1 1v2h10v-2c0-.55-.45-1-1-1h-1v-2c2.76 0 5-2.24 5-5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.76-2.24-5-5-5zm-5 7c0-1.66 1.34-3 3-3s3 1.34 3 3H7zm10 0h-2c0-1.66 1.34-3 3-3s3 1.34 3 3-1.34 3-3 3c0-1.5-.5-2.5-1-3zM6 20h12v2H6v-2z" />
            </svg>
          </div>

          <p className="text-sm font-medium uppercase tracking-wider text-gray-500 mb-2">
            Winner
          </p>

          <h2 className="text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-8 break-words pb-1">
            {winner}
          </h2>

          <div className="flex flex-col gap-3 justify-center">
            <button
              onClick={onSpinAgain || onClose}
              className="w-full px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            >
              Spin Again
            </button>

            {onRemoveAndSpin && (
              <button
                onClick={onRemoveAndSpin}
                className="w-full px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200"
              >
                Remove Winner & Spin Again
              </button>
            )}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 bg-white/50 backdrop-blur"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
