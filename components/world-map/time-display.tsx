"use client"

import { Play, Pause, FastForward } from "lucide-react"

interface TimeDisplayProps {
  day: number
  year: number
  dayOfWeek: string
  time: string
  timeOfDay: "morning" | "noon" | "evening" | "night"
  isPaused: boolean
  speed: number
  onTogglePause: () => void
  onSpeedChange: () => void
}

export function TimeDisplay({
  day,
  year,
  dayOfWeek,
  time,
  timeOfDay,
  isPaused,
  speed,
  onTogglePause,
  onSpeedChange,
}: TimeDisplayProps) {
  const isNight = timeOfDay === "night" || timeOfDay === "evening"

  return (
    <div className="flex items-center gap-2">
      {/* Time Control Buttons */}
      <div className="flex items-center gap-1 bg-[#1a2a3d] rounded-lg p-1 border border-cyan-600/30">
        <button
          onClick={onTogglePause}
          className={`p-1.5 rounded transition-colors ${
            isPaused ? "bg-green-600 text-white hover:bg-green-500" : "bg-yellow-600 text-white hover:bg-yellow-500"
          }`}
          title={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
        </button>
        <button
          onClick={onSpeedChange}
          className="p-1.5 rounded bg-cyan-700 text-white hover:bg-cyan-600 transition-colors flex items-center gap-0.5"
          title="Change speed"
        >
          <FastForward className="w-3 h-3" />
          <span className="text-[10px] font-bold">{speed}x</span>
        </button>
      </div>

      {/* Time Square - Day/Night indicator + Time + Day of Week */}
      <div className="flex items-center gap-2 bg-[#1a2a3d] rounded-lg px-3 py-1.5 border border-cyan-600/30">
        {/* Day/Night indicator */}
        <div
          className="w-3 h-3 rounded-full"
          style={{
            backgroundColor: isNight ? "#C0C0C0" : "#FFD700",
            boxShadow: isNight ? "0 0 6px rgba(192, 192, 192, 0.8)" : "0 0 8px rgba(255, 215, 0, 0.8)",
          }}
        />

        {/* Time and Day of Week */}
        <div className="flex flex-col items-start leading-tight">
          <span className="text-white font-mono text-sm font-bold">{time}</span>
          <span className="text-cyan-300 text-[10px] uppercase">{dayOfWeek}</span>
        </div>
      </div>

      {/* Day and Year Counter */}
      <div className="flex flex-col items-start bg-[#1a2a3d] rounded-lg px-3 py-1 border border-cyan-600/30">
        <span className="text-white font-mono text-sm font-bold leading-tight">Day {day}</span>
        <span className="text-cyan-400 text-[10px] uppercase leading-tight">Year {year}</span>
      </div>
    </div>
  )
}
