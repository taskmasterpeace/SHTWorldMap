"use client"

import { useState, useRef, useEffect } from "react"
import type { Country } from "@/lib/game-data"

interface CountrySelectorProps {
  countries: Country[]
  selectedCountry: Country | null
  onSelectCountry: (country: Country) => void
}

export function CountrySelector({ countries, selectedCountry, onSelectCountry }: CountrySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Filter countries based on search
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort countries alphabetically
  const sortedCountries = [...filteredCountries].sort((a, b) => a.name.localeCompare(b.name))

  // Navigate through countries
  const handlePrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : sortedCountries.length - 1
    setCurrentIndex(newIndex)
    onSelectCountry(sortedCountries[newIndex])
  }

  const handleNext = () => {
    const newIndex = currentIndex < sortedCountries.length - 1 ? currentIndex + 1 : 0
    setCurrentIndex(newIndex)
    onSelectCountry(sortedCountries[newIndex])
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Update current index when country is selected from dropdown
  const handleSelectFromDropdown = (country: Country) => {
    const index = sortedCountries.findIndex((c) => c.code === country.code)
    setCurrentIndex(index >= 0 ? index : 0)
    onSelectCountry(country)
    setIsDropdownOpen(false)
    setSearchQuery("")
  }

  const currentCountry = selectedCountry || sortedCountries[0]

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Main Country Display */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          className="w-10 h-10 bg-[#2EAFC2] hover:bg-[#259AAD] text-white flex items-center justify-center border-2 border-black transition-colors"
        >
          <span className="text-xl">◀</span>
        </button>

        {/* Country Display */}
        <div
          ref={dropdownRef}
          className="relative bg-[#F5BF29] px-6 py-3 border-2 border-black min-w-[300px] cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="flex items-center gap-4">
            {/* Flag Placeholder */}
            <div className="w-12 h-8 bg-white border border-black flex items-center justify-center shrink-0">
              <span className="text-[8px] text-gray-500">FLAG</span>
            </div>

            {/* Country Name */}
            <div className="flex-1">
              <h2 className="font-seymourOne text-xl text-black tracking-wider">
                {currentCountry?.name.toUpperCase() || "SELECT COUNTRY"}
              </h2>
              {currentCountry && (
                <p className="text-xs text-black/70">
                  Pop: {currentCountry.population.toLocaleString()} | {currentCountry.governmentPerception}
                </p>
              )}
            </div>

            {/* Dropdown Arrow */}
            <span className="text-black text-lg">{isDropdownOpen ? "▲" : "▼"}</span>
          </div>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black max-h-[400px] overflow-y-auto z-50 shadow-lg">
              {/* Search Input */}
              <div className="sticky top-0 bg-white p-2 border-b border-black">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full px-3 py-2 border border-black text-sm"
                />
              </div>

              {/* Country List */}
              {sortedCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSelectFromDropdown(country)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-[#F5BF29] flex items-center gap-3 border-b border-gray-200 ${
                    selectedCountry?.code === country.code ? "bg-[#F5BF29]" : ""
                  }`}
                >
                  <div className="w-8 h-6 bg-gray-200 border border-gray-400 flex items-center justify-center shrink-0">
                    <span className="text-[6px] text-gray-500">FLAG</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">{country.name}</p>
                    <p className="text-xs text-gray-600">{country.governmentPerception}</p>
                  </div>
                  <span className="text-xs text-gray-500">{country.population.toLocaleString()}</span>
                </button>
              ))}

              {sortedCountries.length === 0 && <p className="p-4 text-center text-gray-500">No countries found</p>}
            </div>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-10 h-10 bg-[#2EAFC2] hover:bg-[#259AAD] text-white flex items-center justify-center border-2 border-black transition-colors"
        >
          <span className="text-xl">▶</span>
        </button>
      </div>

      {/* Quick Stats */}
      {currentCountry && (
        <div className="flex gap-4 text-white text-xs bg-black/50 px-4 py-2 rounded">
          <span>
            <strong>Leader:</strong> {currentCountry.president || currentCountry.leaderTitle}
          </span>
          <span>
            <strong>Structure:</strong> {currentCountry.governmentStructure}
          </span>
          <span>
            <strong>Military:</strong> {currentCountry.militaryServices}/100
          </span>
        </div>
      )}
    </div>
  )
}
