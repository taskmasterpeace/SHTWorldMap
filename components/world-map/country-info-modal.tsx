"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { Country, City } from "@/lib/game-data"
import { getCitiesForCountry, COUNTRIES } from "@/lib/game-data"
import {
  Check,
  X,
  Ban,
  ChevronLeft,
  ChevronRight,
  Search,
  Shield,
  AlertTriangle,
  Building2,
  GraduationCap,
  Factory,
  TreePine,
  Waves,
  Mountain,
  Landmark,
  Church,
  Pickaxe,
  Ship,
  Palmtree,
  Users,
} from "lucide-react"

interface CountryInfoModalProps {
  country: Country
  cities: City[]
  onClose: () => void
  onSelectCity: (city: City) => void
  onChangeCountry?: (country: Country) => void
  onOpenCities?: () => void
  fundingTotal?: number
}

const getMeterColor = (value: number, invertColor = false): string => {
  const effectiveValue = invertColor ? 100 - value : value
  if (effectiveValue <= 33) return "bg-[#670000]"
  if (effectiveValue <= 66) return "bg-[#f5bf29]"
  return "bg-[#006717]"
}

const getRatingLabel = (value: number): string => {
  if (value <= 10) return "EXTREMELY LOW"
  if (value <= 25) return "VERY LOW"
  if (value <= 40) return "LOW"
  if (value <= 60) return "MEDIUM"
  if (value <= 75) return "HIGH"
  if (value <= 90) return "VERY HIGH"
  return "EXTREMELY HIGH"
}

const getRatingColorText = (value: number): string => {
  if (value <= 33) return "text-[#670000]"
  if (value <= 66) return "text-[#c4a000]"
  return "text-[#006717]"
}

export function CountryInfoModal({
  country,
  cities,
  onClose,
  onSelectCity,
  onChangeCountry,
  onOpenCities,
  fundingTotal = 260000,
}: CountryInfoModalProps) {
  const countryCities = getCitiesForCountry(country.name)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement>(null)

  const filteredCountries = searchQuery.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
    : []

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || filteredCountries.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev < filteredCountries.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredCountries.length - 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filteredCountries[highlightedIndex]) {
        onChangeCountry?.(filteredCountries[highlightedIndex])
        setSearchQuery("")
        setShowDropdown(false)
      }
    } else if (e.key === "Escape") {
      setShowDropdown(false)
    }
  }

  const selectCountryFromSearch = (c: Country) => {
    onChangeCountry?.(c)
    setSearchQuery("")
    setShowDropdown(false)
  }

  const currentIndex = COUNTRIES.findIndex((c) => c.code === country.code)

  const goToPrevCountry = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : COUNTRIES.length - 1
    onChangeCountry?.(COUNTRIES[prevIndex])
  }

  const goToNextCountry = () => {
    const nextIndex = currentIndex < COUNTRIES.length - 1 ? currentIndex + 1 : 0
    onChangeCountry?.(COUNTRIES[nextIndex])
  }

  const RatingBar = ({
    value,
    max = 100,
    showLabel = false,
    invertColor = false,
  }: {
    value: number
    max?: number
    showLabel?: boolean
    invertColor?: boolean
  }) => {
    const segments = 10
    const filledSegments = Math.round((value / max) * segments)
    const effectiveValue = invertColor ? 100 - value : value
    const label = getRatingLabel(effectiveValue)
    const colorClass = getRatingColorText(effectiveValue)
    const meterColor = getMeterColor(value, invertColor)

    return (
      <div>
        <div className="flex gap-px">
          {Array.from({ length: segments }).map((_, i) => (
            <div
              key={i}
              className={`w-[5px] h-2.5 lg:w-[6px] lg:h-3 border border-black ${
                i < filledSegments ? meterColor : "bg-white"
              }`}
            />
          ))}
        </div>
        {showLabel && <p className={`text-[7px] lg:text-[9px] font-bold ${colorClass}`}>{label}</p>}
      </div>
    )
  }

  const LawStatus = ({
    type,
    label,
    icon: Icon,
  }: {
    type: string
    label: string
    icon: React.ElementType
  }) => {
    const isAllowed = type === "Legal" || type === "Allowed" || type === "Yes"
    const isBanned = type === "Illegal" || type === "Banned" || type === "No" || type === "Not Allowed"

    return (
      <div className="bg-white border border-black p-0.5">
        <div className="bg-[#c4c4c4] text-[6px] lg:text-[8px] font-bold text-center px-0.5 mb-0.5 border border-black truncate">
          {label}
        </div>
        <div className="flex items-center justify-center gap-0.5">
          <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#f5bf29] rounded-full flex items-center justify-center border border-black shrink-0">
            <Icon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-black" />
          </div>
          <div
            className={`w-3 h-3 lg:w-4 lg:h-4 rounded flex items-center justify-center shrink-0 ${
              isAllowed ? "bg-[#006717]" : isBanned ? "bg-[#670000]" : "bg-[#c4c4c4]"
            }`}
          >
            {isAllowed ? (
              <Check className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
            ) : isBanned ? (
              <X className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
            ) : (
              <Ban className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-white" />
            )}
          </div>
        </div>
      </div>
    )
  }

  const SectionHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-[#0998c7] text-white font-bold text-center py-0.5 mb-1 border border-black text-[10px] lg:text-xs font-bangers tracking-wide">
      {children}
    </div>
  )

  const StatRow = ({
    icon: Icon,
    label,
    value,
    showLabel = true,
    invertColor = false,
  }: {
    icon: React.ElementType
    label: string
    value: number
    showLabel?: boolean
    invertColor?: boolean
  }) => (
    <div className="bg-white border border-black p-0.5 flex items-start gap-1">
      <div className="w-5 h-5 lg:w-6 lg:h-6 bg-[#f5bf29] rounded-full flex items-center justify-center border border-black shrink-0">
        <Icon className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-black" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="bg-[#c4c4c4] text-[6px] lg:text-[8px] font-bold px-0.5 mb-0.5 border border-black inline-block truncate max-w-full">
          {label}
        </div>
        <RatingBar value={value} showLabel={showLabel} invertColor={invertColor} />
      </div>
    </div>
  )

  const cityTypeIcons = [
    { icon: TreePine, label: "Natural" },
    { icon: Building2, label: "Urban" },
    { icon: Mountain, label: "Mountain" },
    { icon: Factory, label: "Industrial" },
    { icon: Waves, label: "Coastal" },
    { icon: Landmark, label: "Political" },
    { icon: GraduationCap, label: "Educational" },
    { icon: Church, label: "Religious" },
    { icon: Pickaxe, label: "Mining" },
    { icon: Ship, label: "Port" },
    { icon: Palmtree, label: "Resort" },
    { icon: Users, label: "Company" },
  ]

  const avgSafety =
    countryCities.length > 0
      ? Math.round(countryCities.reduce((acc, c) => acc + c.safety, 0) / countryCities.length)
      : 50
  const avgCrime =
    countryCities.length > 0
      ? Math.round(countryCities.reduce((acc, c) => acc + c.crime, 0) / countryCities.length)
      : 50

  return (
    <div className="fixed inset-0 bg-[#0998c7] z-50 flex flex-col h-screen overflow-hidden">
      <div className="bg-[#0998c7] px-2 py-1 shrink-0">
        {/* Top row - Navigation, Flag, Name, Search, Funding */}
        <div className="flex items-center gap-1 lg:gap-2">
          {/* Navigation Arrow Left */}
          <button
            onClick={goToPrevCountry}
            className="w-6 h-6 lg:w-10 lg:h-10 bg-[#f5bf29] flex items-center justify-center border-2 border-black hover:bg-[#e0aa1f] transition-colors shrink-0"
            style={{ clipPath: "polygon(100% 0, 100% 100%, 0 50%)" }}
          >
            <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6 text-black ml-0.5" />
          </button>

          {/* Flag Placeholder */}
          <div className="w-10 h-6 lg:w-16 lg:h-10 bg-white border-2 border-black flex items-center justify-center shrink-0">
            <span className="text-[6px] lg:text-[10px] text-gray-500">FLAG</span>
          </div>

          {/* Navigation Arrow Right */}
          <button
            onClick={goToNextCountry}
            className="w-6 h-6 lg:w-10 lg:h-10 bg-[#f5bf29] flex items-center justify-center border-2 border-black hover:bg-[#e0aa1f] transition-colors shrink-0"
            style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
          >
            <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6 text-black mr-0.5" />
          </button>

          {/* Country Name */}
          <h1 className="font-bangers text-lg lg:text-3xl xl:text-4xl text-[#f5bf29] tracking-wider drop-shadow-[1px_1px_0_#000] lg:drop-shadow-[2px_2px_0_#000] truncate">
            {country.name.toUpperCase()}
          </h1>

          <div className="relative ml-auto hidden sm:block" ref={searchRef}>
            <div className="flex items-center bg-white border-2 border-black px-1 w-32 lg:w-40">
              <Search className="w-3 h-3 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowDropdown(true)
                  setHighlightedIndex(0)
                }}
                onFocus={() => setShowDropdown(true)}
                onKeyDown={handleKeyDown}
                className="w-full p-1 text-[10px] lg:text-xs bg-transparent outline-none"
              />
            </div>

            {showDropdown && filteredCountries.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border-2 border-black max-h-48 overflow-auto z-20 shadow-lg">
                {filteredCountries.map((c, index) => (
                  <button
                    key={c.code}
                    onClick={() => selectCountryFromSearch(c)}
                    className={`w-full text-left px-2 py-1 text-[10px] lg:text-xs flex items-center gap-1 hover:bg-[#f5bf29] transition-colors ${
                      index === highlightedIndex ? "bg-[#f5bf29]" : ""
                    }`}
                  >
                    <span className="font-bold truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Funding Total */}
          <div className="text-right shrink-0 ml-2">
            <p className="text-white text-[8px] lg:text-[10px]">FUNDING</p>
            <p className="font-bangers text-base lg:text-2xl text-[#f5bf29] drop-shadow-[1px_1px_0_#000] lg:drop-shadow-[2px_2px_0_#000]">
              ${fundingTotal.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Second row - Motto, Population, Partners, Adversaries */}
        <div className="flex flex-wrap items-center gap-2 lg:gap-4 text-[8px] lg:text-xs mt-0.5">
          <div className="flex-1 min-w-0">
            <p className="text-white italic text-[8px] lg:text-xs truncate">"{country.motto}"</p>
            <p className="text-[#f5bf29] font-bold text-[10px] lg:text-sm font-bangers tracking-wide">
              Pop: {country.population.toLocaleString()}
            </p>
          </div>

          {/* Partners */}
          <div className="text-center hidden lg:block">
            <p className="text-[#f5bf29] font-bold text-[8px] font-bangers">PARTNERS</p>
            <div className="flex gap-0.5">
              <div className="w-5 h-3 bg-white border border-black" />
              <div className="w-5 h-3 bg-white border border-black" />
            </div>
          </div>

          {/* Adversaries */}
          <div className="text-center hidden lg:block">
            <p className="text-[#f5bf29] font-bold text-[8px] font-bangers">ADVERSARIES</p>
            <div className="flex gap-0.5">
              <div className="w-5 h-3 bg-white border border-black" />
              <div className="w-5 h-3 bg-white border border-black" />
            </div>
          </div>
        </div>
      </div>

      {/* Separator Line */}
      <div className="h-0.5 lg:h-1 bg-black shrink-0" />

      <div className="flex-1 overflow-auto p-1 lg:p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 lg:gap-1.5 h-full lg:min-h-0">
          {/* GOVERNMENT Section */}
          <div className="bg-[#f5bf29] p-1 lg:p-1.5 border-2 border-black flex flex-col">
            <SectionHeader>GOVERNMENT</SectionHeader>

            <p className="text-black text-[8px] lg:text-[10px] mb-1 truncate">
              <span className="font-bold">{country.leaderTitle || "President"}</span> {country.president || "Unknown"}
            </p>

            <div className="bg-[#363636] text-white text-[6px] lg:text-[8px] px-1 inline-block mb-0.5 border border-black">
              STRUCTURE
            </div>
            <p className="text-black font-bold text-[10px] lg:text-xs mb-1 truncate">{country.governmentStructure}</p>

            <div className="bg-[#363636] text-white text-[6px] lg:text-[8px] px-1 inline-block mb-0.5 border border-black">
              PERCEPTION
            </div>
            <p className="text-black font-bold text-[8px] lg:text-[10px] mb-1 truncate">
              {country.governmentPerception}
            </p>

            {/* Government Corruption */}
            <div className="flex items-start gap-1 mb-1">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white rounded-full border border-black flex items-center justify-center shrink-0">
                <span className="text-sm lg:text-base">👤</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-[#c4c4c4] text-[6px] lg:text-[8px] font-bold px-0.5 mb-0.5 border border-black inline-block">
                  GOVT CORRUPTION
                </div>
                <RatingBar value={country.governmentCorruption} showLabel invertColor />
              </div>
            </div>

            {/* LAWS */}
            <div className="bg-[#363636] text-white text-center py-0.5 mb-1 border border-black font-bold text-[8px] lg:text-[10px] font-bangers tracking-wide">
              LAWS
            </div>
            <div className="grid grid-cols-2 gap-0.5 mb-1">
              <LawStatus type={country.vigilantism} label="VIGILANTISM" icon={Shield} />
              <LawStatus type={country.capitalPunishment} label="CAPITAL" icon={AlertTriangle} />
              <LawStatus type={country.lswRegulations} label="LSW" icon={Ban} />
              <LawStatus type={country.cloning} label="CLONING" icon={Users} />
            </div>

            {/* Terrorism */}
            <StatRow icon={AlertTriangle} label="TERRORISM" value={country.terrorismActivity} showLabel invertColor />
          </div>

          {/* CITY INFORMATION Section */}
          <div className="bg-[#f5bf29] p-1 lg:p-1.5 border-2 border-black flex flex-col">
            <SectionHeader>CITY INFO</SectionHeader>

            {/* Safety/Crime Circles */}
            <div className="flex justify-center items-center gap-2 mb-1">
              <div className="text-center">
                <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" fill="white" stroke="black" strokeWidth="2" />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="#006717"
                      strokeWidth="4"
                      strokeDasharray={`${avgSafety * 2.51} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Shield className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
                  </div>
                </div>
                <p className="text-[6px] lg:text-[8px] font-bold bg-[#c4c4c4] border border-black px-0.5">SAFETY</p>
              </div>

              <div className="bg-[#c4c4c4] text-[6px] lg:text-[8px] font-bold px-1 py-0.5 border border-black">AVG</div>

              <div className="text-center">
                <div className="relative w-8 h-8 lg:w-10 lg:h-10">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="45%" fill="white" stroke="black" strokeWidth="2" />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="#670000"
                      strokeWidth="4"
                      strokeDasharray={`${avgCrime * 2.51} 251`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <AlertTriangle className="w-3 h-3 lg:w-4 lg:h-4 text-black" />
                  </div>
                </div>
                <p className="text-[6px] lg:text-[8px] font-bold bg-[#c4c4c4] border border-black px-0.5">CRIME</p>
              </div>
            </div>

            {/* Cities Button & Type Icons */}
            <div className="flex items-start gap-1 mb-1">
              <button
                onClick={onOpenCities}
                className="bg-[#c4c4c4] border border-black px-1.5 py-0.5 font-bold text-[8px] lg:text-[10px] hover:bg-[#b0b0b0] transition-colors shrink-0 font-bangers"
              >
                CITIES
              </button>
              <div className="grid grid-cols-4 gap-px flex-1">
                {cityTypeIcons.slice(0, 8).map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full border border-black flex items-center justify-center"
                    title={label}
                  >
                    <Icon className="w-2 h-2 lg:w-2.5 lg:h-2.5 text-black" />
                  </div>
                ))}
              </div>
            </div>

            {/* HEALTH & SCIENCE */}
            <div className="bg-[#363636] text-white text-center py-0.5 mb-1 border border-black font-bold text-[8px] lg:text-[10px] font-bangers tracking-wide">
              HEALTH & SCIENCE
            </div>
            <div className="space-y-0.5 flex-1">
              <StatRow icon={AlertTriangle} label="LSW ACTIVITY" value={country.lswActivity} showLabel={false} />
              <StatRow icon={Factory} label="SCIENCE" value={country.science} showLabel={false} />
              <StatRow icon={Building2} label="HEALTHCARE" value={country.healthcare} showLabel={false} />
            </div>
          </div>

          {/* LIBERTIES Section */}
          <div className="bg-[#f5bf29] p-1 lg:p-1.5 border-2 border-black flex flex-col">
            <SectionHeader>LIBERTIES</SectionHeader>

            <div className="space-y-0.5 flex-1">
              <StatRow icon={Users} label="LIFESTYLE" value={country.lifestyle} showLabel={false} />
              <StatRow icon={GraduationCap} label="HIGHER ED" value={country.higherEducation} showLabel={false} />
              <StatRow icon={Users} label="SOCIAL PROG" value={country.socialDevelopment} showLabel={false} />
              <StatRow icon={Building2} label="MEDIA FREE" value={country.mediaFreedom} showLabel={false} />
              <StatRow icon={Shield} label="CYBER" value={country.cyberCapabilities} showLabel />
              <StatRow icon={Building2} label="DIGITAL DEV" value={country.digitalDevelopment} showLabel />
            </div>
          </div>

          {/* ECONOMICS & SECURITY Section */}
          <div className="bg-[#f5bf29] p-1 lg:p-1.5 border-2 border-black flex flex-col">
            <SectionHeader>ECONOMICS & SECURITY</SectionHeader>

            <div className="space-y-0.5 flex-1">
              <StatRow icon={Shield} label="MILITARY" value={country.militaryServices} showLabel />
              <StatRow icon={Users} label="INTEL" value={country.intelligenceServices} showLabel />
              <StatRow icon={Shield} label="LAW ENF" value={country.lawEnforcement} showLabel />
              <StatRow icon={Users} label="INDIV WEALTH" value={country.gdpPerCapita} showLabel />
              <StatRow icon={Building2} label="NAT'L WEALTH" value={country.gdpNational} showLabel />
            </div>

            <div className="flex gap-1 mt-auto pt-1">
              <button
                onClick={onOpenCities}
                className="flex-1 bg-[#c4c4c4] py-1 font-bold border-2 border-black hover:bg-[#b0b0b0] transition-colors text-[10px] lg:text-xs font-bangers tracking-wide"
              >
                SELECT
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-[#c4c4c4] py-1 font-bold border-2 border-black hover:bg-[#b0b0b0] transition-colors text-[10px] lg:text-xs font-bangers tracking-wide"
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sm:hidden bg-[#0998c7] px-2 py-1 border-t border-black shrink-0">
        <div className="relative" ref={searchRef}>
          <div className="flex items-center bg-white border-2 border-black px-1">
            <Search className="w-3 h-3 text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="search countries..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowDropdown(true)
                setHighlightedIndex(0)
              }}
              onFocus={() => setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="w-full p-1 text-xs bg-transparent outline-none"
            />
          </div>

          {showDropdown && filteredCountries.length > 0 && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border-2 border-black max-h-48 overflow-auto z-20 shadow-lg">
              {filteredCountries.map((c, index) => (
                <button
                  key={c.code}
                  onClick={() => selectCountryFromSearch(c)}
                  className={`w-full text-left px-2 py-1.5 text-xs flex items-center gap-1 hover:bg-[#f5bf29] transition-colors ${
                    index === highlightedIndex ? "bg-[#f5bf29]" : ""
                  }`}
                >
                  <span className="font-bold truncate">{c.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
