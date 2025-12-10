"use client"

import { useState, useEffect } from "react"
import type { GameMessage, Character, GridCell } from "@/lib/game-data"
import {
  Smartphone,
  Laptop,
  Settings,
  Play,
  Pause,
  FastForward,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  MapPin,
  Plane,
  Car,
  Ship,
  Anchor,
  AlertTriangle,
  Building2,
  Users,
  Clock,
  Navigation,
  Heart,
  Swords,
  Rocket,
} from "lucide-react"
import { getSectorData } from "@/lib/sector-data"

interface Vehicle {
  id: string
  name: string
  type: "aircraft" | "ground" | "sea" | "space"
  status: "available" | "deployed" | "maintenance" | "damaged"
  location: string
  capacity: number
  speed: string
  sector: string // Added sector field to track vehicle location on map
}

const VEHICLES: Vehicle[] = [
  {
    id: "v1",
    name: "Blackhawk Alpha",
    type: "aircraft",
    status: "available",
    location: "HQ Hangar",
    sector: "F15",
    capacity: 12,
    speed: "180 mph",
  },
  {
    id: "v2",
    name: "Stealth Jet",
    type: "aircraft",
    status: "deployed",
    location: "Mission Area",
    sector: "D12",
    capacity: 4,
    speed: "1,200 mph",
  },
  {
    id: "v3",
    name: "APC Thunder",
    type: "ground",
    status: "available",
    location: "Motor Pool",
    sector: "F15",
    capacity: 8,
    speed: "65 mph",
  },
  {
    id: "v4",
    name: "Recon Bike",
    type: "ground",
    status: "maintenance",
    location: "Garage B",
    sector: "F15",
    capacity: 2,
    speed: "120 mph",
  },
  {
    id: "v5",
    name: "Submarine Phantom",
    type: "sea",
    status: "deployed",
    location: "Atlantic Patrol",
    sector: "K8",
    capacity: 20,
    speed: "40 knots",
  },
  {
    id: "v6",
    name: "Patrol Boat",
    type: "sea",
    status: "available",
    location: "Dock 3",
    sector: "G20",
    capacity: 6,
    speed: "55 knots",
  },
  {
    id: "v7",
    name: "Orbital Shuttle",
    type: "space",
    status: "damaged",
    location: "Launch Bay",
    sector: "F15",
    capacity: 6,
    speed: "17,500 mph",
  },
]

interface MessagesPanelProps {
  messages: GameMessage[]
  characters: Character[]
  onCharacterClick?: (character: Character) => void
  selectedCell?: GridCell | null
  isTopPanel?: boolean // Added prop for horizontal top layout
  gameTime?: string
  gameDay?: number
  gameYear?: number
  dayOfWeek?: string
  timeOfDay?: "dawn" | "day" | "dusk" | "night"
  isPaused?: boolean
  timeSpeed?: number
  onTogglePause?: () => void
  onSpeedChange?: () => void
  onShowPhone?: () => void
  onShowLaptop?: () => void
  onShowSettings?: () => void
  showPhone?: boolean
  showLaptop?: boolean
  gridColor?: string
  onGridColorChange?: (color: string) => void
}

type TabType = "character" | "map" | "vehicles"

function getStatusIcon(status: Character["status"], vehicleType?: Character["vehicleType"]) {
  switch (status) {
    case "idle":
      return <Clock className="w-5 h-5 text-gray-400" />
    case "traveling":
      return <Navigation className="w-5 h-5 text-blue-400" />
    case "in-vehicle":
      switch (vehicleType) {
        case "aircraft":
          return <Plane className="w-5 h-5 text-cyan-400" />
        case "ground":
          return <Car className="w-5 h-5 text-yellow-400" />
        case "sea":
          return <Ship className="w-5 h-5 text-blue-400" />
        case "submarine":
          return <Anchor className="w-5 h-5 text-indigo-400" />
        case "space":
          return <Rocket className="w-5 h-5 text-purple-400" />
        default:
          return <Car className="w-5 h-5 text-yellow-400" />
      }
    case "hospitalized":
      return <Heart className="w-5 h-5 text-red-400" />
    case "in-combat":
      return <Swords className="w-5 h-5 text-orange-400" />
    default:
      return <Clock className="w-5 h-5 text-gray-400" />
  }
}

function getStatusLabel(status: Character["status"]) {
  switch (status) {
    case "idle":
      return "Idle"
    case "traveling":
      return "Traveling"
    case "in-vehicle":
      return "In Vehicle"
    case "hospitalized":
      return "Hospitalized"
    case "in-combat":
      return "In Combat"
    default:
      return "Unknown"
  }
}

export function MessagesPanel({
  messages,
  characters,
  onCharacterClick,
  selectedCell,
  isTopPanel = false,
  gameTime = "8:00:00 AM",
  gameDay = 1,
  gameYear = 1,
  dayOfWeek = "Monday",
  timeOfDay = "day",
  isPaused = true,
  timeSpeed = 1,
  onTogglePause,
  onSpeedChange,
  onShowPhone,
  onShowLaptop,
  onShowSettings,
  showPhone = false,
  showLaptop = false,
  gridColor = "cyan",
  onGridColorChange,
}: MessagesPanelProps) {
  const [isMessagesExpanded, setIsMessagesExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>("character")

  useEffect(() => {
    if (selectedCell) {
      setActiveTab("map")
    }
  }, [selectedCell])

  const getVehicleIcon = (type: Vehicle["type"]) => {
    switch (type) {
      case "aircraft":
        return <Plane className="w-4 h-4" />
      case "ground":
        return <Car className="w-4 h-4" />
      case "sea":
        return <Ship className="w-4 h-4" />
      case "space":
        return <Anchor className="w-4 h-4" />
      default:
        return ""
    }
  }

  const getVehicleStatusColor = (status: Vehicle["status"]) => {
    switch (status) {
      case "available":
        return "bg-green-400"
      case "deployed":
        return "bg-blue-400"
      case "maintenance":
        return "bg-yellow-400"
      case "damaged":
        return "bg-red-400"
      default:
        return "bg-gray-400"
    }
  }

  const getMessageIcon = (type: GameMessage["type"]) => {
    switch (type) {
      case "alert":
        return (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px]">!</span>
          </div>
        )
      case "event":
        return (
          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0">
            <span className="text-black text-[10px]">i</span>
          </div>
        )
      case "mission":
        return (
          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px]">M</span>
          </div>
        )
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px]">?</span>
          </div>
        )
    }
  }

  const getTimeOfDayIcon = () => {
    switch (timeOfDay) {
      case "dawn":
        return <Sunrise className="w-4 h-4 text-orange-400" />
      case "day":
        return <Sun className="w-4 h-4 text-yellow-400" />
      case "dusk":
        return <Sunset className="w-4 h-4 text-orange-500" />
      case "night":
        return <Moon className="w-4 h-4 text-blue-300" />
      default:
        return <Sun className="w-4 h-4 text-yellow-400" />
    }
  }

  if (isTopPanel) {
    return (
      <div className="flex items-stretch gap-2 p-2 overflow-x-auto">
        {/* Messages Section - Horizontal */}
        <div className="flex-shrink-0 w-64 bg-[#1a1a2e] border border-[#E71D36] rounded-lg overflow-hidden">
          <button
            onClick={() => setIsMessagesExpanded(!isMessagesExpanded)}
            className="w-full flex items-center justify-between px-2 py-1 bg-[#2a2a3e] hover:bg-[#3a3a4e]"
          >
            <span className="text-white font-bold text-[10px] tracking-wide">MESSAGES</span>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-[#E71D36]">0 new</span>
              <span className="text-white text-xs">{isMessagesExpanded ? "−" : "+"}</span>
            </div>
          </button>
          {isMessagesExpanded && (
            <div className="max-h-[100px] overflow-y-auto p-2">
              <p className="text-gray-500 text-[10px] text-center italic">No messages</p>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-1">
          {[
            {
              id: "character" as TabType,
              label: "TEAM",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "map" as TabType,
              label: "MAP",
              icon: <MapPin className="w-4 h-4" />,
            },
            {
              id: "vehicles" as TabType,
              label: "VEHICLES",
              icon: <Anchor className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-colors border ${
                activeTab === tab.id
                  ? "bg-[#F5BF29] text-[#141204] border-[#E71D36]"
                  : "bg-[#1a2a3d] text-cyan-400 border-cyan-600/30 hover:bg-[#2a3a4d]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content - Horizontal Card */}
        <div className="flex-1 min-w-[300px] bg-[#F5BF29] border border-[#E71D36] rounded-lg overflow-hidden">
          {activeTab === "character" && (
            <div className="flex items-center gap-2 p-2 overflow-x-auto">
              {characters.map((char) => {
                const charSector = getSectorData(char.sectorId)
                const sectorName = charSector
                  ? charSector.name !== `Sector ${char.sectorId}`
                    ? charSector.name
                    : charSector.country || charSector.region
                  : "Unknown"
                return (
                  <div
                    key={char.id}
                    onClick={() => onCharacterClick?.(char)}
                    className="flex-shrink-0 flex items-center gap-2 px-2 py-1 bg-[rgba(0,0,0,0.1)] rounded cursor-pointer hover:bg-[rgba(231,29,54,0.3)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] border border-cyan-600 flex items-center justify-center">
                      {getStatusIcon(char.status, char.vehicleType)}
                    </div>
                    <div>
                      <p className="text-[#141204] font-bold text-[10px]">{char.codename}</p>
                      <p className="text-[#141204]/70 text-[8px]">{char.sectorId}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === "map" && (
            <div className="p-2">
              {selectedCell ? (
                (() => {
                  const sectorData = getSectorData(selectedCell.id)
                  return (
                    <div className="flex items-center gap-4">
                      <div className="bg-[rgba(231,29,54,0.6)] rounded px-2 py-1">
                        <span className="text-white font-bold text-xs">SECTOR {selectedCell.id}</span>
                      </div>
                      <div className="flex flex-col">
                        {/* Country */}
                        <span className="text-[#141204] font-bold text-sm">
                          {sectorData.country || sectorData.countries?.join(", ") || selectedCell.region}
                        </span>
                        {/* City - underneath country */}
                        {sectorData.cities.length > 0 && (
                          <span className="text-[#141204]/70 text-xs">
                            {sectorData.cities.map((c) => c.name).join(", ")}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 text-[10px]">
                        <span className="text-[#141204]/70">
                          Terrain: <span className="text-[#141204]">{selectedCell.terrain}</span>
                        </span>
                        <span className="text-[#141204]/70">
                          Climate: <span className="text-[#141204]">{selectedCell.climate}</span>
                        </span>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <p className="text-[#141204]/70 text-xs">Click a sector on the map to view info</p>
              )}
            </div>
          )}

          {activeTab === "vehicles" && (
            <div className="flex items-center gap-2 p-2 overflow-x-auto">
              {VEHICLES.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="flex-shrink-0 flex items-center gap-2 px-2 py-1 bg-[rgba(0,0,0,0.1)] rounded"
                >
                  {getVehicleIcon(vehicle.type)}
                  <span className="text-[#141204] text-[10px] font-bold whitespace-nowrap">{vehicle.name}</span>
                  <div
                    className={`w-2 h-2 rounded-full border border-black ${getVehicleStatusColor(vehicle.status)}`}
                    title={vehicle.status}
                  />
                  <span className="text-[#141204]/70 text-[9px] whitespace-nowrap">{vehicle.location}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      {/* Messages Section - more compact */}
      <div className="bg-[#1a1a2e] border border-[#E71D36] rounded-lg overflow-hidden">
        <button
          onClick={() => setIsMessagesExpanded(!isMessagesExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#2a2a3e] hover:bg-[#3a3a4e]"
        >
          <span className="text-white font-bangers text-sm tracking-wide">MESSAGES</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#E71D36]">0 new</span>
            <span className="text-white text-sm">{isMessagesExpanded ? "−" : "+"}</span>
          </div>
        </button>

        {isMessagesExpanded && (
          <div className="max-h-[160px] overflow-y-auto p-3">
            <p className="text-gray-500 text-xs text-center italic">No messages yet</p>
          </div>
        )}
      </div>

      {/* Tabbed Team/Map/Vehicles Section - compact */}
      <div className="flex-1 bg-[#F5BF29] border border-[#E71D36] rounded-lg overflow-hidden flex flex-col">
        <div className="flex border-b-2 border-[#E71D36]">
          {[
            {
              id: "character" as TabType,
              label: "TEAM",
              icon: <Users className="w-4 h-4" />,
            },
            {
              id: "map" as TabType,
              label: "MAP",
              icon: <MapPin className="w-4 h-4" />,
            },
            {
              id: "vehicles" as TabType,
              label: "VEHICLES",
              icon: <Anchor className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-bold tracking-wide transition-colors ${
                activeTab === tab.id
                  ? "bg-[#F5BF29] text-[#141204] border-b-2 border-[#141204]"
                  : "bg-[rgba(0,0,0,0.2)] text-[#141204]/70 hover:bg-[rgba(0,0,0,0.1)]"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content - fills available space */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "character" && (
            <div>
              <div className="px-3 py-2 bg-[rgba(231,29,54,0.6)]">
                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Team Roster</h3>
              </div>
              <div className="divide-y divide-cyan-900/30">
                {characters.map((char) => {
                  const charSector = getSectorData(char.sectorId)
                  const sectorName = charSector
                    ? charSector.name !== `Sector ${char.sectorId}`
                      ? charSector.name
                      : charSector.country || charSector.region
                    : "Unknown"
                  return (
                    <div
                      key={char.id}
                      onClick={() => onCharacterClick?.(char)}
                      className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-[rgba(231,29,54,0.2)] transition-colors"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-[#1a1a2e] border-2 border-cyan-600 flex items-center justify-center">
                          {getStatusIcon(char.status, char.vehicleType)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-cyan-100 font-bold text-sm truncate">{char.codename || char.name}</p>
                        <p className="text-cyan-400/70 text-xs truncate">{getStatusLabel(char.status)}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-yellow-400 font-mono font-bold text-sm">{char.sectorId || "N/A"}</p>
                        <p className="text-cyan-400/70 text-[10px] truncate max-w-[80px]">{sectorName}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <div className="p-3 min-h-[180px]">
              {selectedCell ? (
                (() => {
                  const sectorData = getSectorData(selectedCell.id)
                  if (!sectorData) {
                    return (
                      <div className="text-[#141204]/70 text-sm">Sector data unavailable for {selectedCell.id}</div>
                    )
                  }
                  const vehiclesInSector = VEHICLES.filter((v) => v.sector === selectedCell.id)
                  return (
                    <div className="space-y-2">
                      {/* Sector Header */}
                      <div className="bg-[rgba(231,29,54,0.6)] rounded px-3 py-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white font-bangers text-base tracking-wider">
                            SECTOR {selectedCell.id}
                          </span>
                          <span className="text-white/80 text-xs">
                            Col {selectedCell.col + 1} / Row {String.fromCharCode(65 + selectedCell.row)}
                          </span>
                        </div>
                      </div>

                      {/* Country - Primary display */}
                      <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                        <p className="text-xs text-[#141204]/70 uppercase">Country</p>
                        <p className="text-[#141204] font-bold text-lg">
                          {sectorData.country || sectorData.countries?.join(", ") || "International Waters"}
                        </p>
                      </div>

                      {/* Cities - underneath country */}
                      {sectorData.cities.length > 0 && (
                        <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                          <p className="text-xs text-[#141204]/70 uppercase flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            Cities
                          </p>
                          <div className="space-y-1 mt-1">
                            {sectorData.cities.map((city, idx) => (
                              <div key={idx} className="flex items-center justify-between">
                                <span className="text-[#141204] text-sm font-medium">
                                  {city.name}
                                  {city.isCapital && <span className="text-yellow-600 ml-1">★</span>}
                                </span>
                                <span className="text-[#141204]/60 text-xs">Pop: {city.population}M</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                        <p className="text-xs text-[#141204]/70 uppercase flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          Vehicles in Sector
                        </p>
                        {vehiclesInSector.length > 0 ? (
                          <div className="space-y-1 mt-1">
                            {vehiclesInSector.map((vehicle) => (
                              <div key={vehicle.id} className="flex items-center justify-between">
                                <span className="text-[#141204] text-sm font-medium flex items-center gap-1">
                                  {getVehicleIcon(vehicle.type)}
                                  {vehicle.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2.5 h-2.5 rounded-full border border-black ${getVehicleStatusColor(vehicle.status)}`}
                                    title={vehicle.status}
                                  />
                                  <span className="text-[#141204]/60 text-xs capitalize">{vehicle.status}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[#141204]/50 text-xs mt-1">No vehicles in this sector</p>
                        )}
                      </div>

                      {/* Region */}
                      <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                        <p className="text-xs text-[#141204]/70 uppercase">Region</p>
                        <p className="text-[#141204] text-sm">{sectorData.region}</p>
                      </div>

                      {/* Terrain & Climate */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                          <p className="text-[10px] text-[#141204]/70 uppercase">Terrain</p>
                          <p className="text-[#141204] text-xs">{selectedCell.terrain}</p>
                        </div>
                        <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                          <p className="text-[10px] text-[#141204]/70 uppercase">Climate</p>
                          <p className="text-[#141204] text-xs">{selectedCell.climate}</p>
                        </div>
                      </div>

                      {/* Threat & Control Status */}
                      {(sectorData.threatLevel > 0 || sectorData.controlledBy !== "neutral") && (
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                            <p className="text-[10px] text-[#141204]/70 uppercase flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Threat Level
                            </p>
                            <p
                              className={`text-xs font-bold ${
                                sectorData.threatLevel >= 7
                                  ? "text-red-600"
                                  : sectorData.threatLevel >= 4
                                    ? "text-yellow-600"
                                    : "text-green-600"
                              }`}
                            >
                              {sectorData.threatLevel}/10
                            </p>
                          </div>
                          <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                            <p className="text-[10px] text-[#141204]/70 uppercase">Control</p>
                            <p
                              className={`text-xs font-bold capitalize ${
                                sectorData.controlledBy === "allies"
                                  ? "text-blue-600"
                                  : sectorData.controlledBy === "enemies"
                                    ? "text-red-600"
                                    : sectorData.controlledBy === "contested"
                                      ? "text-orange-600"
                                      : "text-gray-600"
                              }`}
                            >
                              {sectorData.controlledBy}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Intel */}
                      {selectedCell.intel && (
                        <div className="bg-[rgba(0,0,0,0.2)] rounded px-3 py-2">
                          <p className="text-xs text-[#141204]/70 uppercase">Intel</p>
                          <p className="text-[#141204] text-xs italic">{selectedCell.intel}</p>
                        </div>
                      )}
                    </div>
                  )
                })()
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                  <svg
                    className="w-12 h-12 text-[#141204]/30 mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  <p className="text-[#141204]/50 text-sm font-medium">No Sector Selected</p>
                  <p className="text-[#141204]/40 text-xs mt-1">Click a sector on the map</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "vehicles" && (
            <div>
              <div className="px-3 py-2 bg-[rgba(231,29,54,0.6)]">
                <span className="text-white font-bangers text-sm tracking-wider">FLEET STATUS</span>
              </div>
              <div className="max-h-[180px] overflow-y-auto">
                {VEHICLES.map((vehicle, index) => (
                  <div
                    key={vehicle.id}
                    className={`flex items-center px-3 py-2 ${index % 2 === 0 ? "bg-[rgba(135,135,135,0.3)]" : ""}`}
                  >
                    {getVehicleIcon(vehicle.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-[#141204] text-xs font-bold truncate">{vehicle.name}</p>
                      <p className="text-[#141204]/60 text-[10px] truncate">{vehicle.location}</p>
                    </div>
                    <div
                      className={`w-3 h-3 rounded-full border border-black flex-shrink-0 ml-2 ${getVehicleStatusColor(vehicle.status)}`}
                      title={vehicle.status}
                    />
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="px-3 py-2 border-t border-[#E71D36]/50 flex flex-wrap gap-3 text-[10px]">
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400 border border-black" /> Available
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-400 border border-black" /> Deployed
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black" /> Maintenance
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 border border-black" /> Damaged
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#1a1a2e] border border-cyan-600/50 rounded-lg p-2">
        {/* Date/Time Row */}
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2">
            {getTimeOfDayIcon()}
            <span className="text-cyan-100 font-mono text-sm">{gameTime}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-cyan-400">{dayOfWeek}</span>
            <span className="text-cyan-100 font-bold">Day {gameDay}</span>
            <span className="text-cyan-400/70">Year {gameYear}</span>
          </div>
        </div>

        {/* Play Controls Row */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <button
            onClick={onTogglePause}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded transition-colors border ${
              isPaused
                ? "bg-green-600/20 border-green-500/50 text-green-400 hover:bg-green-600/30"
                : "bg-yellow-600/20 border-yellow-500/50 text-yellow-400 hover:bg-yellow-600/30"
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span className="text-xs font-bold">{isPaused ? "PLAY" : "PAUSE"}</span>
          </button>
          <button
            onClick={onSpeedChange}
            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-600/30 transition-colors"
          >
            <FastForward className="w-4 h-4" />
            <span className="text-xs font-bold">{timeSpeed}X</span>
          </button>
        </div>

        {/* Device/Settings Buttons Row */}
        <div className="flex items-center gap-2">
          <button
            onClick={onShowPhone}
            className={`flex-1 flex items-center justify-center gap-1 py-2 rounded transition-colors border ${
              showPhone
                ? "bg-cyan-600 border-cyan-400 text-white"
                : "bg-[#2a3a4d] border-cyan-600/30 text-cyan-400 hover:bg-[#3a4a5d]"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="text-xs font-bold">PHONE</span>
          </button>
          <button
            onClick={onShowLaptop}
            className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded transition-colors border ${
              showLaptop
                ? "bg-cyan-600 border-cyan-400 text-white"
                : "bg-[#2a3a4d] border-cyan-600/30 text-cyan-400 hover:bg-[#3a4a5d]"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span className="text-xs font-bold">LAPTOP</span>
          </button>
          <div className="relative">
            <button
              onClick={onShowSettings}
              className="p-2 rounded bg-[#2a3a4d] border border-cyan-600/30 text-cyan-400 hover:bg-[#3a4a5d] transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            {/* Grid Color Picker inside settings */}
            {onGridColorChange && (
              <div className="absolute bottom-full right-0 mb-1 hidden group-hover:block">
                {/* Color picker will be shown on settings click */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export type { Character }
