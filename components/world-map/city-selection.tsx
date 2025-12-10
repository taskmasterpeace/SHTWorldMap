"use client"

import { useState, useRef, useEffect } from "react"
import type { City, Country } from "@/lib/game-data"

interface CitySelectionProps {
  country: Country
  cities: City[]
  onSelect: (city: City) => void
  onBack: () => void
}

// City type icons - using emoji/unicode for now, can be replaced with actual icons
const CITY_TYPE_ICONS: Record<string, { icon: string; label: string }> = {
  Military: { icon: "🎖️", label: "Military" },
  Political: { icon: "🏛️", label: "Political" },
  Educational: { icon: "🎓", label: "Educational" },
  Company: { icon: "🏢", label: "Company" },
  Industrial: { icon: "🏭", label: "Industrial" },
  Temple: { icon: "⛪", label: "Temple" },
  Mining: { icon: "⛏️", label: "Mining" },
  Resort: { icon: "🏖️", label: "Resort" },
  Seaport: { icon: "🚢", label: "Seaport" },
}

// Population type colors
const POPULATION_TYPE_COLORS: Record<string, string> = {
  Village: "#ef4444",
  "Small Town": "#ef4444",
  Town: "#f97316",
  "Small City": "#eab308",
  City: "#eab308",
  "Large City": "#22c55e",
  "Mega City": "#22c55e",
}

const POPULATION_TYPES = [
  { type: "Village", minPop: 0 },
  { type: "Small Town", minPop: 10000 },
  { type: "Town", minPop: 50000 },
  { type: "Small City", minPop: 100000 },
  { type: "City", minPop: 500000 },
  { type: "Large City", minPop: 1000000 },
  { type: "Mega City", minPop: 10000000 },
]

export function CitySelection({ country, cities, onSelect, onBack }: CitySelectionProps) {
  const [selectedIndex, setSelectedIndex] = useState(Math.min(2, Math.floor(cities.length / 2)))
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [needsScroll, setNeedsScroll] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const checkScrollNeeded = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current
        const cardWidth = window.innerWidth < 640 ? 130 : 150 // card + gap
        const availableWidth = container.clientWidth - 80 // minus arrow buttons space
        const totalCardsWidth = cities.length * cardWidth
        setNeedsScroll(totalCardsWidth > availableWidth)
        setContainerWidth(availableWidth)
      }
    }

    checkScrollNeeded()
    window.addEventListener("resize", checkScrollNeeded)
    return () => window.removeEventListener("resize", checkScrollNeeded)
  }, [cities.length])

  // Scroll to keep selected card centered
  useEffect(() => {
    if (scrollContainerRef.current && needsScroll) {
      const container = scrollContainerRef.current
      const cardWidth = window.innerWidth < 640 ? 130 : 150
      const scrollPosition = selectedIndex * cardWidth - container.clientWidth / 2 + cardWidth / 2
      container.scrollTo({ left: Math.max(0, scrollPosition), behavior: "smooth" })
    }
  }, [selectedIndex, needsScroll])

  const handleScroll = (direction: "left" | "right") => {
    if (direction === "left" && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1)
    } else if (direction === "right" && selectedIndex < cities.length - 1) {
      setSelectedIndex(selectedIndex + 1)
    }
  }

  const selectedCity = cities[selectedIndex]

  // Get population bar width based on type
  const getPopulationBarWidth = (popType: string) => {
    const index = POPULATION_TYPES.findIndex((p) => p.type === popType)
    if (index === -1) return "20%"
    return `${((index + 1) / POPULATION_TYPES.length) * 100}%`
  }

  return (
    <div className="fixed inset-0 bg-[#0998c7] flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 p-2 sm:p-3">
        {/* Country Flag and Name */}
        <div className="flex items-center gap-2">
          <div className="w-12 h-8 sm:w-16 sm:h-10 bg-white border-2 border-black flex items-center justify-center text-[8px] sm:text-[10px] text-gray-500">
            FLAG
          </div>
          <h1 className="font-bangers text-xl sm:text-2xl text-black">{country.name.toUpperCase()}</h1>
        </div>

        {/* Title Banner */}
        <div className="flex-1 flex justify-center">
          <div className="bg-[#FFB801] px-3 sm:px-6 py-1 sm:py-2 border-2 border-black">
            <p className="text-[8px] sm:text-[10px] text-red-600 font-bold text-center">SELECT A CITY FOR YOUR</p>
            <h2 className="font-bangers text-lg sm:text-2xl text-black text-center">CORPORATE HEADQUARTERS</h2>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden p-2 sm:p-4 gap-2">
        {/* City Cards Carousel */}
        <div className="flex-1 bg-[#FFB801] border-4 border-black p-2 sm:p-4 flex flex-col">
          <div className="flex-1 flex items-center justify-center relative">
            {needsScroll && (
              <button
                onClick={() => handleScroll("left")}
                className="absolute left-0 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-[#FFB801] border-2 border-black flex items-center justify-center text-lg sm:text-xl hover:bg-yellow-400 disabled:opacity-30"
                disabled={selectedIndex === 0}
              >
                ◀
              </button>
            )}

            <div
              ref={scrollContainerRef}
              className={`flex items-center gap-2 sm:gap-3 py-2 ${
                needsScroll ? "overflow-x-auto scrollbar-hide px-10 sm:px-12" : "overflow-visible justify-center px-2"
              }`}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {cities.map((city, index) => {
                const isSelected = index === selectedIndex
                const popColor = POPULATION_TYPE_COLORS[city.populationType] || "#eab308"

                return (
                  <div
                    key={`${city.name}-${index}`}
                    onClick={() => setSelectedIndex(index)}
                    className={`relative cursor-pointer transition-all duration-200 flex-shrink-0 ${
                      isSelected ? "scale-105 z-10" : "scale-95 opacity-60"
                    }`}
                  >
                    {/* Selection Arrows */}
                    {isSelected && (
                      <>
                        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-r-[12px] border-r-[#FFB801]" />
                        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[12px] border-l-[#FFB801]" />
                      </>
                    )}

                    {/* Card */}
                    <div
                      className={`w-[120px] sm:w-[140px] bg-[#FFB801] border-2 ${isSelected ? "border-[#0998c7] border-4" : "border-black"}`}
                    >
                      {/* City Name */}
                      <div className="bg-gray-200 py-1 px-2 border-b-2 border-black">
                        <h3 className="font-bold text-center text-[10px] sm:text-xs truncate">{city.name}</h3>
                      </div>

                      {/* Flag */}
                      <div className="flex justify-end p-1 bg-gradient-to-b from-[#87CEEB] to-[#87CEEB]">
                        <div className="w-10 h-6 bg-white border border-black flex items-center justify-center text-[6px] text-gray-400">
                          FLAG
                        </div>
                      </div>

                      {/* City Image */}
                      <div className="h-16 sm:h-20 bg-gradient-to-b from-[#87CEEB] via-[#90EE90] to-[#DEB887]">
                        <img
                          src={`/.jpg?height=80&width=140&query=${city.populationType} ${city.cityTypes[0] || "city"} landscape`}
                          alt={city.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Safety / Crime */}
                      <div className="flex border-t-2 border-black bg-white">
                        <div className="flex-1 p-1 border-r border-black text-center">
                          <p className="text-[6px] sm:text-[8px] font-bold bg-gray-300 px-1">SAFETY</p>
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="text-[8px]">🏛️</span>
                            <span className="text-[10px] sm:text-xs font-bold">
                              {city.safetyIndex?.toFixed(0) || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 p-1 text-center">
                          <p className="text-[6px] sm:text-[8px] font-bold bg-gray-300 px-1">CRIME</p>
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <span className="text-[8px]">🦹</span>
                            <span className="text-[10px] sm:text-xs font-bold">
                              {city.crimeIndex?.toFixed(0) || "?"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Population */}
                      <div className="bg-white p-1 border-t border-black">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: popColor }} />
                          <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                backgroundColor: popColor,
                                width: getPopulationBarWidth(city.populationType),
                              }}
                            />
                          </div>
                        </div>
                        <p className="text-[8px] sm:text-[10px] font-bold text-center mt-0.5">
                          {city.population?.toLocaleString() || "N/A"}
                        </p>
                      </div>

                      {/* City Types */}
                      <div className="bg-white p-1 border-t border-black flex flex-wrap gap-0.5 justify-center min-h-[32px]">
                        {city.cityTypes
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((type, i) => (
                            <div
                              key={i}
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#FFB801] border border-black flex items-center justify-center"
                              title={CITY_TYPE_ICONS[type]?.label || type}
                            >
                              <span className="text-[10px] sm:text-xs">{CITY_TYPE_ICONS[type]?.icon || "?"}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {needsScroll && (
              <button
                onClick={() => handleScroll("right")}
                className="absolute right-0 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-[#FFB801] border-2 border-black flex items-center justify-center text-lg sm:text-xl hover:bg-yellow-400 disabled:opacity-30"
                disabled={selectedIndex === cities.length - 1}
              >
                ▶
              </button>
            )}
          </div>

          {needsScroll && (
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => handleScroll("left")} className="text-black text-sm">
                ◀
              </button>
              <div className="flex-1 h-3 bg-white border border-black rounded-sm overflow-hidden">
                <div
                  className="h-full bg-gray-400 transition-all"
                  style={{
                    width: `${Math.max(10, 100 / cities.length)}%`,
                    marginLeft: `${(selectedIndex / Math.max(1, cities.length - 1)) * (100 - Math.max(10, 100 / cities.length))}%`,
                  }}
                />
              </div>
              <button onClick={() => handleScroll("right")} className="text-black text-sm">
                ▶
              </button>
            </div>
          )}
        </div>

        {/* Right Side - Population Legend (hidden on mobile) */}
        <div className="hidden lg:flex flex-col gap-2 w-48 bg-white/90 p-3 border-2 border-black">
          <h3 className="font-bold text-sm text-center border-b border-black pb-1">Population Types</h3>
          {POPULATION_TYPES.map((pop, i) => (
            <div key={pop.type} className="flex items-center gap-2">
              <span className="text-[10px] w-16">{pop.type}</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: POPULATION_TYPE_COLORS[pop.type],
                    width: `${((i + 1) / POPULATION_TYPES.length) * 100}%`,
                  }}
                />
              </div>
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: POPULATION_TYPE_COLORS[pop.type] }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 flex justify-end gap-3 p-2 sm:p-3">
        <button
          onClick={() => selectedCity && onSelect(selectedCity)}
          className="px-6 sm:px-10 py-1.5 sm:py-2 bg-white font-bangers text-sm sm:text-lg border-2 border-black hover:bg-gray-100 shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
        >
          START
        </button>
        <button
          onClick={onBack}
          className="px-6 sm:px-10 py-1.5 sm:py-2 bg-white font-bangers text-sm sm:text-lg border-2 border-black hover:bg-gray-100 shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
        >
          BACK
        </button>
      </div>
    </div>
  )
}
