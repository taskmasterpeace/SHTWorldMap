"use client"

import { useState } from "react"
import type { Investigation } from "@/lib/game-data"

interface StatusPanelProps {
  investigations: Investigation[]
}

export function StatusPanel({ investigations }: StatusPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="w-[280px] bg-[#1a1a2e] border border-[#E71D36] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-3 py-2 bg-[#2a2a3e] hover:bg-[#3a3a4e]"
      >
        <span className="text-white font-bangers text-sm tracking-wide">ACTIVE CASES</span>
        <span className="text-white">{isExpanded ? "−" : "+"}</span>
      </button>

      {isExpanded && (
        <div className="p-2 max-h-[300px] overflow-y-auto">
          {investigations.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-4">No active cases</p>
          ) : (
            investigations.map((inv) => (
              <div key={inv.id} className="bg-[#2a2a3e] rounded p-2 mb-2 last:mb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white font-bold text-sm">{inv.title}</span>
                  <span className="text-[#E71D36] text-xs">{inv.type}</span>
                </div>
                <div className="w-full bg-[#1a1a1a] rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all"
                    style={{ width: `${inv.progress}%` }}
                  />
                </div>
                <span className="text-green-400 text-xs">{inv.progress}%</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
