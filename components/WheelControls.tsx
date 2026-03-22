"use client"

import { useState } from "react"

interface NamesPanelProps {
  items: string[]
  onAddName: (name: string) => void
  onRemoveName: (index: number) => void
  onClearAll: () => void
  onCopyShareLink: () => void
  onSaveImage: () => void
  eliminateMode: boolean
  onEliminateModeChange: (val: boolean) => void
}

const COLORS = [
  "#FF6B6B",
  "#FF9F43",
  "#FECA57",
  "#48DBFB",
  "#FF9FF3",
  "#54A0FF",
  "#5F27CD",
  "#00D2D3",
  "#1DD1A1",
  "#C8D6E5",
]

function getColorForIndex(index: number): string {
  return COLORS[index % COLORS.length]
}

export default function WheelControls({
  items,
  onAddName,
  onRemoveName,
  onClearAll,
  onCopyShareLink,
  onSaveImage,
  eliminateMode,
  onEliminateModeChange,
}: NamesPanelProps) {
  const [inputValue, setInputValue] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      onAddName(trimmedValue)
      setInputValue("")
    }
  }

  const handleCopyShareLink = () => {
    onCopyShareLink()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="w-full lg:w-80 bg-white overflow-hidden flex flex-col"
      style={{
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.08)",
        height: "420px",
      }}
    >
      {/* Header */}
      <div className="px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-100 flex-shrink-0">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2 m-0">
          Wheel Items
          <span className="ml-auto text-sm font-medium text-gray-500 bg-white px-2 py-0.5 rounded-full shadow-sm border border-gray-100">
            {items.length}
          </span>
        </h2>
      </div>

      {/* Add name form */}
      <form onSubmit={handleSubmit} className="p-3 border-b border-gray-100 flex-shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter an item..."
            className="flex-1 px-3 py-2 text-sm text-gray-800 border bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className="px-3 py-2 text-sm font-medium text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(90deg, #6C5CE7 0%, #a855f7 100%)",
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </form>

      {/* Names list - scrollable with hidden scrollbar */}
      <div
        className="flex-1 overflow-y-auto min-h-0 container-snap"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style jsx>{`
          .container-snap::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {items.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mx-auto w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No items added yet</p>
            <p className="text-xs text-gray-400 mt-1">Add items above to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-50 m-0 p-0 text-left">
            {items.map((name, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white shadow-sm"
                    style={{
                      background: getColorForIndex(index),
                    }}
                  >
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-700 font-medium truncate">{name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveName(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                  aria-label={`Remove ${name}`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Eliminate toggle */}
      <div className="px-4 py-2 border-t border-gray-100 flex-shrink-0 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEliminateModeChange(!eliminateMode)}
          aria-label="Toggle eliminate after spin"
          style={{
            width: "40px",
            height: "20px",
            borderRadius: "10px",
            background: eliminateMode ? "#6C5CE7" : "#ddd",
            border: "none",
            cursor: "pointer",
            position: "relative",
            flexShrink: 0,
            transition: "background 0.2s",
            padding: 0,
          }}
        >
          <span
            style={{
              position: "absolute",
              width: "16px",
              height: "16px",
              borderRadius: "50%",
              background: "white",
              top: "2px",
              left: eliminateMode ? "22px" : "2px",
              transition: "left 0.2s",
              display: "block",
            }}
          />
        </button>
        <span style={{ fontSize: "13px", color: "#555" }}>Eliminate after spin</span>
      </div>

      {/* Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-100 space-y-2 flex-shrink-0">
        <button
          onClick={handleCopyShareLink}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-xl transition-all"
          style={{
            backgroundColor: copied ? "#10b981" : "#00b894",
          }}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Link Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Copy Share Link
            </>
          )}
        </button>
        <button
          onClick={onSaveImage}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border"
          style={{
            backgroundColor: "white",
            borderColor: "#e0e0e0",
            color: "#555",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f5f5f5" }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Save as Image
        </button>
        <button
          onClick={onClearAll}
          disabled={items.length === 0}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-red-100"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Clear All
        </button>
      </div>
    </div>
  )
}
