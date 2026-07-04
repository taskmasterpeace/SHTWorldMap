"use client"

import type React from "react"

import { useState, useMemo, useRef, useEffect, useCallback } from "react"
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid3X3,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
} from "lucide-react"
import { MobilePhone } from "@/components/world-map/mobile-phone"
import { TimeDisplay } from "@/components/world-map/time-display"
import { MessagesPanel, type Character } from "@/components/world-map/messages-panel"
import { CountryInfoModal } from "@/components/world-map/country-info-modal"
import { CitySelection } from "@/components/world-map/city-selection"
import { CharacterScreen, type FullCharacter } from "@/components/world-map/character-screen"
import { LaptopUI } from "@/components/world-map/laptop-ui"
import { getCitiesForCountry, type Country, type City, SAMPLE_CHARACTERS, SAMPLE_MESSAGES } from "@/lib/game-data"
import { MAP_GRID, GRID_COLS, GRID_ROWS, type GridCell } from "@/lib/map-grid-data"

const SAMPLE_FULL_CHARACTERS: FullCharacter[] = [
  {
    id: "1",
    name: "Randall 'Stampede' Jenkins",
    codename: "Stampede",
    avatar: "/superhero-man-with-beard.jpg",
    age: 32,
    identity: "SECRET",
    nationality: "United States",
    nationalityCode: "US",
    role: "hero",
    status: "active",
    primaryStats: { melee: 24, agility: 56, strength: 52, intellect: 24, instinct: 23, mental: 16 },
    secondaryStats: { health: 23, defense: 12, dodge: -1, evasion: -2, initiative: 23 },
    powers: [
      { id: "1", name: "Super Strength", icon: "fire", level: 3 },
      { id: "2", name: "Speed", icon: "missile", level: 2 },
    ],
    gear: {
      ready: [
        { id: "1", name: "Pistol", icon: "pistol", quantity: 1 },
        { id: "2", name: "Grenades", icon: "grenade", quantity: 2 },
      ],
      container: [{ id: "3", name: "Body Armor", icon: "armor", quantity: 1 }],
      personal: [],
    },
    education: "Military Academy",
    career: "Special Forces",
    skills: [
      { id: "1", name: "Combat", icon: "combat", level: 10, stars: 5 },
      { id: "2", name: "Tactics", icon: "leadership", level: 8, stars: 4 },
    ],
    attributes: [
      { name: "Fearless", positive: true },
      { name: "Quick Reflexes", positive: true },
      { name: "Reckless", positive: false },
    ],
    payment: { weekly: 2500, yearly: 130000 },
    cityFamiliarity: [
      { city: "Wakiso", countryCode: "UG", level: 85 },
      { city: "Miami", countryCode: "US", level: 60 },
    ],
    birthplace: "Texas, USA",
    training: [
      { name: "Combat Training", percentage: 92 },
      { name: "Stealth", percentage: 45 },
    ],
    experience: [
      { name: "Military Ops", percentage: 88 },
      { name: "Rescue Missions", percentage: 34 },
    ],
  },
  {
    id: "2",
    name: "Jake 'CrossFire' Gallagar",
    codename: "CrossFire",
    avatar: "/superhero-man-tactical.jpg",
    age: 28,
    identity: "SECRET",
    nationality: "United States",
    nationalityCode: "US",
    role: "hero",
    status: "mission",
    primaryStats: { melee: 18, agility: 72, strength: 35, intellect: 45, instinct: 38, mental: 22 },
    secondaryStats: { health: 18, defense: 15, dodge: -2, evasion: -1, initiative: 28 },
    powers: [{ id: "1", name: "Precision", icon: "missile", level: 4 }],
    gear: {
      ready: [
        { id: "1", name: "Sniper Rifle", icon: "pistol", quantity: 1 },
        { id: "2", name: "Helmet", icon: "helmet", quantity: 1 },
      ],
      container: [],
      personal: [],
    },
    education: "Police Academy",
    career: "Sniper",
    skills: [
      { id: "1", name: "Marksmanship", icon: "combat", level: 10, stars: 5 },
      { id: "2", name: "Stealth", icon: "navigation", level: 7, stars: 3 },
    ],
    attributes: [
      { name: "Eagle Eye", positive: true },
      { name: "Patient", positive: true },
      { name: "Loner", positive: false },
    ],
    payment: { weekly: 2200, yearly: 114400 },
    cityFamiliarity: [{ city: "Miami", countryCode: "US", level: 95 }],
    birthplace: "Florida, USA",
    training: [
      { name: "Sniper Training", percentage: 98 },
      { name: "Recon", percentage: 67 },
    ],
    experience: [
      { name: "Assassination", percentage: 72 },
      { name: "Surveillance", percentage: 81 },
    ],
  },
  {
    id: "3",
    name: "Cissy Oliva",
    codename: "Engineer",
    avatar: "/superhero-woman.png",
    age: 26,
    identity: "PUBLIC",
    nationality: "Brazil",
    nationalityCode: "BR",
    role: "support",
    status: "active",
    primaryStats: { melee: 8, agility: 25, strength: 12, intellect: 85, instinct: 42, mental: 55 },
    secondaryStats: { health: 12, defense: 8, dodge: 0, evasion: 0, initiative: 15 },
    powers: [],
    gear: {
      ready: [{ id: "1", name: "Toolkit", icon: "helmet", quantity: 1 }],
      container: [],
      personal: [],
    },
    education: "MIT Engineering",
    career: "Tech Specialist",
    skills: [
      { id: "1", name: "Engineering", icon: "leadership", level: 10, stars: 5 },
      { id: "2", name: "Hacking", icon: "navigation", level: 9, stars: 4 },
    ],
    attributes: [
      { name: "Genius", positive: true },
      { name: "Workaholic", positive: true },
      { name: "Physically Weak", positive: false },
    ],
    payment: { weekly: 3500, yearly: 182000 },
    cityFamiliarity: [
      { city: "Wakiso", countryCode: "UG", level: 40 },
      { city: "Sao Paulo", countryCode: "BR", level: 90 },
    ],
    birthplace: "Sao Paulo, Brazil",
    training: [
      { name: "Tech Training", percentage: 95 },
      { name: "First Aid", percentage: 30 },
    ],
    experience: [
      { name: "R&D Projects", percentage: 88 },
      { name: "Field Ops", percentage: 15 },
    ],
  },
]

const GRID_CELL_SIZE = 40 // Fixed pixel size for each grid cell
const ZOOM_LEVELS = [1, 1.25, 1.5, 1.75]

const MAP_WIDTH = GRID_COLS * GRID_CELL_SIZE // Total map width in pixels (40 cols = 1600px)
const MAP_HEIGHT = GRID_ROWS * GRID_CELL_SIZE // Total map height in pixels (24 rows = 960px)
const ROW_LABEL_WIDTH = 20 // Width of the row labels column on left
const COL_LABEL_HEIGHT = 16 // Height of the column labels row on top
const ROW_LABELS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
]

export default function WorldMapPage() {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [showCountryInfo, setShowCountryInfo] = useState(false)
  const [showCitySelection, setShowCitySelection] = useState(false)
  const [showCharacterScreen, setShowCharacterScreen] = useState(false)
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0)
  const [currentDay, setCurrentDay] = useState(1)
  const [currentYear, setCurrentYear] = useState(1)
  const [currentTime, setCurrentTime] = useState("8:00AM")
  const [dayOfWeek, setDayOfWeek] = useState("Monday")
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "noon" | "evening" | "night">("morning")
  const [showPhone, setShowPhone] = useState(false)
  const [showLaptop, setShowLaptop] = useState(false)
  const [isTimePaused, setIsTimePaused] = useState(true)
  const [timeSpeed, setTimeSpeed] = useState(1)
  const [gameMinutes, setGameMinutes] = useState(8 * 60) // Start at 8:00 AM (480 minutes)
  const [gameSeconds, setGameSeconds] = useState(0) // Added seconds tracking

  const [showGrid, setShowGrid] = useState(true)
  const [gridColor, setGridColor] = useState("cyan")
  const [showGridColorPicker, setShowGridColorPicker] = useState(false)
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null)
  const [hoveredCell, setHoveredCell] = useState<GridCell | null>(null)

  const [mapScale, setMapScale] = useState(ZOOM_LEVELS[0])
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef<HTMLDivElement>(null)

  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null)

  // New state for mobile panel management
  const [mobilePanel, setMobilePanel] = useState<"comms" | null>(null) // Simplified to only 'comms' for cases

  const [controlsMinimized, setControlsMinimized] = useState(false)

  const constrainMapPosition = useCallback((x: number, y: number, scale: number) => {
    const container = mapContainerRef.current
    if (!container) return { x, y }

    const containerWidth = container.clientWidth - ROW_LABEL_WIDTH
    const containerHeight = container.clientHeight - COL_LABEL_HEIGHT

    const scaledMapWidth = MAP_WIDTH * scale
    const scaledMapHeight = MAP_HEIGHT * scale

    // Calculate bounds - can't pan beyond map edges
    const minX = Math.min(0, containerWidth - scaledMapWidth)
    const minY = Math.min(0, containerHeight - scaledMapHeight)
    const maxX = 0
    const maxY = 0

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y)),
    }
  }, [])

  const dayNightStyle = useMemo(() => {
    // Parse current hour from time string
    const timeMatch = currentTime.match(/(\d+):(\d+):(\d+)(AM|PM)/) // Added seconds to regex
    if (!timeMatch) return { filter: "none", overlay: "transparent", stars: false, period: "day" }

    let hour = Number.parseInt(timeMatch[1])
    const minute = Number.parseInt(timeMatch[2])
    const second = Number.parseInt(timeMatch[3])
    const isPM = timeMatch[4] === "PM"

    // Convert to 24-hour format
    if (isPM && hour !== 12) hour += 12
    if (!isPM && hour === 12) hour = 0

    // Define time periods and their visual styles
    // Night: 0-5 (midnight to early morning)
    // Dawn: 5-7 (sunrise)
    // Day: 7-17 (morning to afternoon)
    // Dusk: 17-20 (sunset)
    // Night: 20-24 (evening to midnight)

    if (hour >= 0 && hour < 5) {
      // Deep night
      return {
        filter: "brightness(0.4) saturate(0.6) hue-rotate(10deg)",
        overlay: "rgba(10, 20, 50, 0.5)",
        stars: true,
        period: "night",
      }
    } else if (hour >= 5 && hour < 7) {
      // Dawn
      const progress = (hour - 5) / 2
      return {
        filter: `brightness(${0.4 + progress * 0.5}) saturate(${0.6 + progress * 0.3})`,
        overlay: `rgba(255, 150, 80, ${0.3 - progress * 0.2})`,
        stars: false,
        period: "dawn",
      }
    } else if (hour >= 7 && hour < 17) {
      // Full day
      return {
        filter: "brightness(1) saturate(1)",
        overlay: "transparent",
        stars: false,
        period: "day",
      }
    } else if (hour >= 17 && hour < 20) {
      // Dusk
      const progress = (hour - 17) / 3
      return {
        filter: `brightness(${1 - progress * 0.5}) saturate(${1 - progress * 0.3}) hue-rotate(${progress * 10}deg)`,
        overlay: `rgba(255, 100, 50, ${progress * 0.25})`,
        stars: false,
        period: "dusk",
      }
    } else {
      // Night
      const progress = Math.min((hour - 20) / 4, 1)
      return {
        filter: `brightness(${0.5 - progress * 0.1}) saturate(0.6) hue-rotate(10deg)`,
        overlay: `rgba(10, 20, 50, ${0.3 + progress * 0.2})`,
        stars: true,
        period: "night",
      }
    }
  }, [currentTime])

  const countryCities = useMemo(() => {
    if (!selectedCountry) return []
    return getCitiesForCountry(selectedCountry.name)
  }, [selectedCountry])

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country)
    setShowCountryInfo(true)
  }

  const handleCitySelect = (city: City) => {
    console.log("Selected city:", city.name)
    setShowCitySelection(false)
    setShowCountryInfo(false)
  }

  const handleSelectFromCountryInfo = () => {
    setShowCountryInfo(false)
    setShowCitySelection(true)
  }

  const handleOpenCities = () => {
    setShowCountryInfo(false)
    setShowCitySelection(true)
  }

  const handleCharacterSelect = (character: Character) => {
    const index = SAMPLE_FULL_CHARACTERS.findIndex((c) => c.id === character.id)
    if (index >= 0) {
      setSelectedCharacterIndex(index)
      setShowCharacterScreen(true)
    }
  }

  // This handler seems to be used for character clicks within the team/character panel
  const handleTeamCharacterClick = (character: Character) => {
    const index = SAMPLE_FULL_CHARACTERS.findIndex((c) => c.id === character.id)
    if (index >= 0) {
      setSelectedCharacterIndex(index)
      setShowCharacterScreen(true)
    }
  }

  const handleOpenLaptop = () => {
    setShowLaptop(true)
    setIsTimePaused(true)
  }

  const handleCloseLaptop = () => {
    setShowLaptop(false)
    setIsTimePaused(false)
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return // Only left click
      setIsDragging(true)
      setDragStart({ x: e.clientX - mapPosition.x, y: e.clientY - mapPosition.y })
    },
    [mapPosition],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return
      const newX = e.clientX - dragStart.x
      const newY = e.clientY - dragStart.y
      const container = mapContainerRef.current
      const containerWidth = container?.clientWidth || 600
      const containerHeight = container?.clientHeight || 400
      const constrained = constrainMapPosition(newX, newY, mapScale) // Pass mapScale here
      setMapPosition(constrained)
    },
    [isDragging, dragStart, constrainMapPosition, mapScale],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const rect = mapContainerRef.current?.getBoundingClientRect()
      if (!rect) return

      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const delta = e.deltaY > 0 ? -0.1 : 0.1 // Adjust zoom sensitivity
      const newScale = Math.max(ZOOM_LEVELS[0], Math.min(ZOOM_LEVELS[ZOOM_LEVELS.length - 1], mapScale + delta))

      // Calculate zoom origin to keep cursor centered
      const zoomOriginX = mouseX / (GRID_COLS * GRID_CELL_SIZE * mapScale)
      const zoomOriginY = mouseY / (GRID_ROWS * GRID_CELL_SIZE * mapScale)

      setMapScale(newScale)

      // Adjust map position after zoom
      requestAnimationFrame(() => {
        const newWidth = GRID_COLS * GRID_CELL_SIZE * newScale
        const newHeight = GRID_ROWS * GRID_CELL_SIZE * newScale

        // Recalculate constrained position based on the *new* scale and viewport size
        const containerWidth = rect.width
        const containerHeight = rect.height
        const scaledMapWidth = MAP_WIDTH * newScale
        const scaledMapHeight = MAP_HEIGHT * newScale

        // Calculate the theoretical new position before constraining
        const theoreticalNewX = mouseX - zoomOriginX * newWidth
        const theoreticalNewY = mouseY - zoomOriginY * newHeight

        // Apply constraints
        const minX = Math.min(0, containerWidth - scaledMapWidth)
        const minY = Math.min(0, containerHeight - scaledMapHeight)
        const maxX = 0
        const maxY = 0

        const constrainedX = Math.max(minX, Math.min(maxX, theoreticalNewX))
        const constrainedY = Math.max(minY, Math.min(maxY, theoreticalNewY))

        setMapPosition({
          x: constrainedX,
          y: constrainedY,
        })
      })
    },
    [mapScale],
  )

  const handleZoomIn = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(mapScale)
    if (currentIndex < ZOOM_LEVELS.length - 1) {
      const newScale = ZOOM_LEVELS[currentIndex + 1]
      const container = mapContainerRef.current
      if (!container) {
        setMapScale(newScale)
        return
      }

      const containerWidth = container.clientWidth - ROW_LABEL_WIDTH
      const containerHeight = container.clientHeight - COL_LABEL_HEIGHT

      if (selectedCell) {
        // Calculate selected cell center position in map coordinates
        const cellCenterX = (selectedCell.col - 1) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2
        const cellCenterY = selectedCell.row * GRID_CELL_SIZE + GRID_CELL_SIZE / 2

        // Calculate new position to center the selected cell in viewport
        const newX = -(cellCenterX * newScale - containerWidth / 2)
        const newY = -(cellCenterY * newScale - containerHeight / 2)

        // Constrain to bounds
        const scaledMapWidth = MAP_WIDTH * newScale
        const scaledMapHeight = MAP_HEIGHT * newScale
        const minX = Math.min(0, containerWidth - scaledMapWidth)
        const minY = Math.min(0, containerHeight - scaledMapHeight)

        setMapScale(newScale)
        setMapPosition({
          x: Math.max(minX, Math.min(0, newX)),
          y: Math.max(minY, Math.min(0, newY)),
        })
      } else {
        // No cell selected - just zoom and constrain
        setMapScale(newScale)
        setTimeout(() => {
          const scaledMapWidth = MAP_WIDTH * newScale
          const scaledMapHeight = MAP_HEIGHT * newScale
          const minX = Math.min(0, containerWidth - scaledMapWidth)
          const minY = Math.min(0, containerHeight - scaledMapHeight)

          setMapPosition((prev) => ({
            x: Math.max(minX, Math.min(0, prev.x)),
            y: Math.max(minY, Math.min(0, prev.y)),
          }))
        }, 0)
      }
    }
  }, [mapScale, selectedCell])

  const handleZoomOut = useCallback(() => {
    const currentIndex = ZOOM_LEVELS.indexOf(mapScale)
    if (currentIndex > 0) {
      const newScale = ZOOM_LEVELS[currentIndex - 1]
      const container = mapContainerRef.current
      if (!container) {
        setMapScale(newScale)
        return
      }

      const containerWidth = container.clientWidth - ROW_LABEL_WIDTH
      const containerHeight = container.clientHeight - COL_LABEL_HEIGHT

      if (selectedCell) {
        // Calculate selected cell center position in map coordinates
        const cellCenterX = (selectedCell.col - 1) * GRID_CELL_SIZE + GRID_CELL_SIZE / 2
        const cellCenterY = selectedCell.row * GRID_CELL_SIZE + GRID_CELL_SIZE / 2

        // Calculate new position to center the selected cell in viewport
        const newX = -(cellCenterX * newScale - containerWidth / 2)
        const newY = -(cellCenterY * newScale - containerHeight / 2)

        // Constrain to bounds
        const scaledMapWidth = MAP_WIDTH * newScale
        const scaledMapHeight = MAP_HEIGHT * newScale
        const minX = Math.min(0, containerWidth - scaledMapWidth)
        const minY = Math.min(0, containerHeight - scaledMapHeight)

        setMapScale(newScale)
        setMapPosition({
          x: Math.max(minX, Math.min(0, newX)),
          y: Math.max(minY, Math.min(0, newY)),
        })
      } else {
        // No cell selected - just zoom and constrain
        setMapScale(newScale)
        setTimeout(() => {
          const scaledMapWidth = MAP_WIDTH * newScale
          const scaledMapHeight = MAP_HEIGHT * newScale
          const minX = Math.min(0, containerWidth - scaledMapWidth)
          const minY = Math.min(0, containerHeight - scaledMapHeight)

          setMapPosition((prev) => ({
            x: Math.max(minX, Math.min(0, prev.x)),
            y: Math.max(minY, Math.min(0, prev.y)),
          }))
        }, 0)
      }
    }
  }, [mapScale, selectedCell])

  const handlePan = useCallback(
    (direction: "up" | "down" | "left" | "right") => {
      const panAmount = 100 // Pixels to pan
      setMapPosition((prev) => {
        let newX = prev.x
        let newY = prev.y

        switch (direction) {
          case "up":
            newY += panAmount
            break
          case "down":
            newY -= panAmount
            break
          case "left":
            newX += panAmount
            break
          case "right":
            newX -= panAmount
            break
        }

        const container = mapContainerRef.current
        const containerWidth = container?.clientWidth || 600
        const containerHeight = container?.clientHeight || 400
        // Call constrainMapPosition with the correct arguments (newX, newY, mapScale)
        const constrained = constrainMapPosition(newX, newY, mapScale)

        return constrained
      })
    },
    [constrainMapPosition, mapScale],
  )

  const handleResetView = useCallback(() => {
    setMapScale(ZOOM_LEVELS[0])
    setMapPosition({ x: 0, y: 0 })
  }, [])

  const handleCellClick = useCallback((cell: GridCell) => {
    setSelectedCell(cell)
    // Close mobile panels when a cell is selected on the map
    setMobilePanel(null)
  }, [])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1) {
        // Single finger - pan
        setTouchStart({ x: e.touches[0].clientX - mapPosition.x, y: e.touches[0].clientY - mapPosition.y })
        setIsDragging(true)
      } else if (e.touches.length === 2) {
        // Two fingers - pinch zoom
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        setLastTouchDistance(distance)
        setIsDragging(false) // Disable panning during pinch
      }
    },
    [mapPosition],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && touchStart && isDragging) {
        // Single finger pan
        const newX = e.touches[0].clientX - touchStart.x
        const newY = e.touches[0].clientY - touchStart.y

        const viewportWidth = mapContainerRef.current?.offsetWidth || window.innerWidth
        const viewportHeight = mapContainerRef.current?.offsetHeight || window.innerHeight
        const currentMapWidth = GRID_COLS * GRID_CELL_SIZE * mapScale
        const currentMapHeight = GRID_ROWS * GRID_CELL_SIZE * mapScale

        const maxPanX = Math.max(0, (currentMapWidth - viewportWidth) / 2)
        const maxPanY = Math.max(0, (currentMapHeight - viewportHeight) / 2)

        setMapPosition({
          x: Math.max(-maxPanX, Math.min(maxPanX, newX)),
          y: Math.max(-maxPanY, Math.min(maxPanY, newY)),
        })
      } else if (e.touches.length === 2 && lastTouchDistance !== null) {
        // Pinch zoom
        const distance = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY,
        )
        const delta = (distance - lastTouchDistance) * 0.005 // Adjust zoom sensitivity
        setMapScale((prev) => Math.max(ZOOM_LEVELS[0], Math.min(ZOOM_LEVELS[ZOOM_LEVELS.length - 1], prev + delta)))
        setLastTouchDistance(distance)
      }
    },
    [touchStart, isDragging, mapScale, lastTouchDistance],
  )

  const handleTouchEnd = useCallback(() => {
    setTouchStart(null)
    setLastTouchDistance(null)
    setIsDragging(false)
  }, [])

  // New component for displaying characters in the team panel
  const CharacterPanel = ({
    characters,
    onCharacterClick,
  }: { characters: Character[]; onCharacterClick: (character: Character) => void }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
      {characters.map((character) => (
        <div
          key={character.id}
          className="flex items-center gap-2 p-2 bg-[#1a2a3a] border border-cyan-600/40 rounded-md cursor-pointer hover:bg-[#2a3a4a] transition-colors"
          onClick={() => onCharacterClick(character)}
        >
          <img
            src={character.avatar || "/placeholder.svg"}
            alt={character.name}
            className="w-10 h-10 rounded-full object-cover border border-cyan-500/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-cyan-100 text-xs font-bold truncate">{character.name}</p>
            <p className="text-cyan-400 text-[10px] truncate">{character.codename || "No Codename"}</p>
            <p
              className={`text-xs font-semibold ${character.status === "active" ? "text-green-400" : character.status === "mission" ? "text-yellow-400" : "text-red-400"}`}
            >
              {character.status.toUpperCase()}
            </p>
          </div>
        </div>
      ))}
    </div>
  )

  const handleTogglePause = useCallback(() => {
    setIsTimePaused((prev) => !prev)
  }, [])

  const handleSpeedChange = useCallback(() => {
    setTimeSpeed((prev) => {
      if (prev === 1) return 2
      if (prev === 2) return 4
      return 1
    })
  }, [])

  // At 1X: 6 game seconds per 100ms (60 per real second = 1 game minute per real second)
  // At 2X: 12 game seconds per 100ms (120 per real second = 2 game minutes per real second)
  // At 4X: 24 game seconds per 100ms (240 per real second = 4 game minutes per real second)
  useEffect(() => {
    if (isTimePaused) return

    const interval = setInterval(() => {
      setGameSeconds((prevSeconds) => {
        // Add 6 * timeSpeed seconds every 100ms for smooth visual tick
        let newSeconds = prevSeconds + 6 * timeSpeed

        // Check if we've passed a minute (60 seconds)
        if (newSeconds >= 60) {
          const minutesToAdd = Math.floor(newSeconds / 60)
          newSeconds = newSeconds % 60

          setGameMinutes((prevMinutes) => {
            let newMinutes = prevMinutes + minutesToAdd

            // Check if we've passed midnight (1440 minutes = 24 hours)
            if (newMinutes >= 1440) {
              newMinutes = newMinutes - 1440 // Reset to next day

              // Advance day
              setCurrentDay((prevDay) => {
                const newDay = prevDay + 1
                // Update day of week
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
                const dayIndex = (newDay - 1) % 7
                setDayOfWeek(days[dayIndex === 0 ? 1 : dayIndex]) // Start on Monday

                // Check for year change (365 days per year)
                if (newDay > 365) {
                  setCurrentYear((prevYear) => prevYear + 1)
                  return 1 // Reset to day 1
                }
                return newDay
              })
            }

            return newMinutes
          })
        }

        return newSeconds
      })
    }, 100) // Run every 100ms instead of 1000ms for smooth visual tick

    return () => clearInterval(interval)
  }, [isTimePaused, timeSpeed])

  useEffect(() => {
    const hours24 = Math.floor(gameMinutes / 60)
    const minutes = gameMinutes % 60

    // Convert to 12-hour format
    const hours12 = hours24 % 12 || 12
    const period = hours24 < 12 ? "AM" : "PM"
    const formattedTime = `${hours12}:${minutes.toString().padStart(2, "0")}:${gameSeconds.toString().padStart(2, "0")}${period}`

    setCurrentTime(formattedTime)

    // Update time of day
    if (hours24 >= 5 && hours24 < 12) {
      setTimeOfDay("morning")
    } else if (hours24 >= 12 && hours24 < 17) {
      setTimeOfDay("noon")
    } else if (hours24 >= 17 && hours24 < 21) {
      setTimeOfDay("evening")
    } else {
      setTimeOfDay("night")
    }
  }, [gameMinutes, gameSeconds])

  const gridCells = useMemo(() => MAP_GRID, []) // Use the imported MAP_GRID

  return (
    // Changed to h-screen w-screen and added style for grid color
    <div
      className="h-screen w-screen flex flex-col bg-[#0a1628] overflow-hidden"
      style={
        {
          "--grid-color":
            gridColor === "cyan"
              ? "rgba(6, 182, 212, 0.3)"
              : gridColor === "green"
                ? "rgba(34, 197, 94, 0.3)"
                : gridColor === "red"
                  ? "rgba(239, 68, 68, 0.3)"
                  : gridColor === "yellow"
                    ? "rgba(234, 179, 8, 0.3)"
                    : gridColor === "purple"
                      ? "rgba(168, 85, 247, 0.3)"
                      : "rgba(255, 255, 255, 0.3)",
        } as React.CSSProperties
      }
    >
      {/* Top Bar - Time Display and Controls */}
      <div className="flex-shrink-0 bg-[#0d1a2d] border-b-2 border-cyan-600/50 px-2 sm:px-4 py-2 flex items-center justify-between">
        {/* Left - Country Flag and Name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-[120px] sm:min-w-[180px]">
          {selectedCountry && (
            <>
              <div className="w-8 h-6 sm:w-10 sm:h-7 rounded overflow-hidden border-2 border-cyan-500/50 shadow-lg">
                <img
                  src={`https://flagcdn.com/w80/${selectedCountry.code.toLowerCase()}.png`}
                  alt={selectedCountry.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-cyan-100 font-bold text-xs sm:text-sm uppercase tracking-wide leading-tight">
                  {selectedCountry.name}
                </span>
                <span className="text-cyan-400/70 text-[10px] sm:text-xs">Headquarters</span>
              </div>
            </>
          )}
        </div>

        {/* Center - Date and Time */}
        <div className="flex-1 flex justify-center">
          <TimeDisplay
            day={currentDay}
            year={currentYear}
            dayOfWeek={dayOfWeek}
            time={currentTime}
            timeOfDay={timeOfDay}
            isPaused={isTimePaused}
            speed={timeSpeed}
            onTogglePause={handleTogglePause}
            onSpeedChange={handleSpeedChange}
          />
        </div>

        <div className="min-w-[120px] sm:min-w-[180px]" />
      </div>

      {/* Main Content Area - Map and Right Panel */}
      <div className="flex-1 flex flex-col md:flex-row gap-2 p-1 sm:p-2 min-h-0 overflow-hidden">
        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex gap-1 flex-shrink-0 mb-1">
          <button
            onClick={() => setMobilePanel(mobilePanel === "comms" ? null : "comms")}
            className={`flex-1 py-1.5 text-xs font-bold uppercase rounded ${mobilePanel === "comms" ? "bg-cyan-600 text-white" : "bg-[#1a2a3d] text-cyan-400"}`}
          >
            Panel
          </button>
        </div>

        <div className="flex-1 flex flex-row min-h-0 gap-2">
          {/* LEFT - Map Panel */}
          {/* CHANGED map from 3/4 to 2/3 width */}
          <div className="flex-1 md:w-2/3 md:flex-none flex flex-col min-h-0 bg-[#0d1a2d] border-2 border-cyan-600/30 rounded-lg overflow-hidden relative">
            {/* Map Viewport Container */}
            <div className="flex-1 relative overflow-hidden bg-[#0a0a1a]" ref={mapContainerRef}>
              {/* Fixed Column Labels at Top - stays visible when panning */}
              <div
                className="absolute top-0 left-0 right-0 z-30 bg-[#0a0a1a] overflow-hidden"
                style={{
                  height: `${COL_LABEL_HEIGHT}px`,
                  paddingLeft: `${ROW_LABEL_WIDTH}px`, // Offset for row labels
                }}
              >
                <div
                  className="flex"
                  style={{
                    transform: `translateX(${mapPosition.x * mapScale}px) scale(${mapScale})`,
                    transformOrigin: "top left",
                    width: `${MAP_WIDTH}px`, // Use MAP_WIDTH
                  }}
                >
                  {Array.from({ length: GRID_COLS }, (_, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-center font-mono text-[8px] transition-colors ${
                        hoveredCell?.col === i || selectedCell?.col === i
                          ? "text-yellow-300 font-bold"
                          : "text-cyan-400/70"
                      }`}
                      style={{ width: `${GRID_CELL_SIZE}px`, height: `${COL_LABEL_HEIGHT}px`, flexShrink: 0 }}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Row Labels on Left - stays visible when panning */}
              <div
                className="absolute top-0 left-0 bottom-0 z-30 bg-[#0a0a1a] overflow-hidden"
                style={{
                  width: `${ROW_LABEL_WIDTH}px`,
                  paddingTop: `${COL_LABEL_HEIGHT}px`, // Offset for column labels
                }}
              >
                <div
                  className="flex flex-col"
                  style={{
                    transform: `translateY(${mapPosition.y * mapScale}px) scale(${mapScale})`,
                    transformOrigin: "top left",
                    height: `${MAP_HEIGHT}px`, // Use MAP_HEIGHT
                  }}
                >
                  {ROW_LABELS.slice(0, GRID_ROWS).map((label, index) => (
                    <div
                      key={label}
                      className={`flex items-center justify-center font-mono text-[8px] transition-colors ${
                        hoveredCell?.row === index || selectedCell?.row === index
                          ? "text-yellow-300 font-bold"
                          : "text-cyan-400/70"
                      }`}
                      style={{ width: `${ROW_LABEL_WIDTH}px`, height: `${GRID_CELL_SIZE}px`, flexShrink: 0 }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Corner cell - top left */}
              <div
                className="absolute top-0 left-0 z-40 bg-[#0a0a1a]"
                style={{ width: `${ROW_LABEL_WIDTH}px`, height: `${COL_LABEL_HEIGHT}px` }}
              />

              {/* Scrollable Map Area - offset for headers */}
              <div
                className="absolute bottom-0 right-0 overflow-hidden cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                  top: `${COL_LABEL_HEIGHT}px`,
                  left: `${ROW_LABEL_WIDTH}px`,
                }}
              >
                <div
                  className="relative"
                  style={{
                    width: `${MAP_WIDTH}px`, // Use MAP_WIDTH
                    height: `${MAP_HEIGHT}px`, // Use MAP_HEIGHT
                    transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {/* Map Image with Day/Night Filter */}
                  <img
                    src="/world-map-pixel.jpg"
                    alt="World Map"
                    className="absolute top-0 left-0 pointer-events-none transition-all duration-1000"
                    style={{
                      width: `${MAP_WIDTH}px`,
                      height: `${MAP_HEIGHT}px`,
                      imageRendering: "pixelated",
                    }}
                    draggable={false}
                  />

                  <div
                    className="absolute pointer-events-none transition-all duration-1000"
                    style={{
                      backgroundColor: dayNightStyle.overlay,
                      width: `${MAP_WIDTH}px`,
                      height: `${MAP_HEIGHT}px`,
                    }}
                  />

                  {dayNightStyle.stars && (
                    <div
                      className="absolute pointer-events-none overflow-hidden"
                      style={{
                        width: `${MAP_WIDTH}px`,
                        height: `${MAP_HEIGHT}px`,
                      }}
                    >
                      {Array.from({ length: 50 }, (_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{
                            left: `${(i * 37) % 100}%`,
                            top: `${(i * 23) % 100}%`,
                            opacity: 0.3 + (i % 5) * 0.15,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: `${2 + (i % 3)}s`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {/* Grid Cells */}
                  {showGrid && (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${GRID_COLS}, ${GRID_CELL_SIZE}px)`,
                        gridTemplateRows: `repeat(${GRID_ROWS}, ${GRID_CELL_SIZE}px)`,
                        width: `${MAP_WIDTH}px`, // Use MAP_WIDTH
                        height: `${MAP_HEIGHT}px`, // Use MAP_HEIGHT
                      }}
                    >
                      {gridCells.map((cell) => (
                        <div
                          key={cell.id}
                          className={`border transition-colors pointer-events-auto ${
                            selectedCell?.id === cell.id
                              ? "bg-yellow-500/30 border-yellow-400"
                              : hoveredCell?.id === cell.id
                                ? "bg-cyan-500/20 border-cyan-400"
                                : `border-${gridColor}-500/30`
                          }`}
                          style={{
                            borderColor:
                              selectedCell?.id === cell.id
                                ? undefined
                                : hoveredCell?.id === cell.id
                                  ? undefined
                                  : `var(--grid-color, rgba(6, 182, 212, 0.3))`,
                          }}
                          onClick={() => handleCellClick(cell)}
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Day/Night Indicator - inside viewport */}
              <div
                className="absolute z-20"
                style={{ top: `${COL_LABEL_HEIGHT + 8}px`, left: `${ROW_LABEL_WIDTH + 8}px` }}
              >
                <div className="bg-[#0d1a2d]/90 border border-cyan-600/50 rounded px-2 py-1 flex items-center gap-2">
                  {dayNightStyle.period === "night" && <Moon className="w-3 h-3 text-blue-300" />}
                  {dayNightStyle.period === "day" && <Sun className="w-3 h-3 text-yellow-400" />}
                  {dayNightStyle.period === "dawn" && <Sun className="w-3 h-3 text-orange-400" />}
                  {dayNightStyle.period === "dusk" && <Sun className="w-3 h-3 text-orange-500" />}
                  <span className="text-cyan-300 text-[10px] font-mono capitalize">{dayNightStyle.period}</span>
                </div>
              </div>

              {/* Selected Sector Info - Bottom Center Overlay */}
              {selectedCell && (
                <div
                  className="absolute z-20"
                  style={{ bottom: `${COL_LABEL_HEIGHT + 8}px`, left: "50%", transform: "translateX(-50%)" }}
                >
                  <div className="bg-[#0d1a2d]/90 border border-yellow-500/50 rounded px-3 py-1">
                    <span className="text-yellow-300 text-xs font-mono">
                      {selectedCell.id} - {selectedCell.region}
                    </span>
                  </div>
                </div>
              )}

              <div className="absolute top-2 right-2 z-20">
                <button
                  onClick={() => {
                    /* TODO: Open search modal */
                  }}
                  className="p-2 rounded-lg bg-[#0d1a2d]/90 border border-cyan-600/50 text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                  title="Search Map"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute z-20 flex flex-col items-end gap-1" style={{ bottom: `8px`, right: `8px` }}>
                {controlsMinimized ? (
                  /* Minimized state - just show expand button */
                  <button
                    onClick={() => setControlsMinimized(false)}
                    className="p-2 rounded-lg bg-[#0d1a2d]/90 border border-cyan-600/50 text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                    title="Expand Controls"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                ) : (
                  /* Expanded state - show all controls */
                  <>
                    {/* Control Buttons - compact row */}
                    <div className="flex items-center gap-1 bg-[#0d1a2d]/90 rounded-lg p-1 border border-cyan-600/50">
                      {/* Minimize button */}
                      <button
                        onClick={() => setControlsMinimized(true)}
                        className="p-1.5 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                        title="Minimize Controls"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      <div className="w-px h-5 bg-cyan-600/30" />
                      <button
                        onClick={() => setShowGrid(!showGrid)}
                        className={`p-1.5 rounded transition-colors ${showGrid ? "bg-cyan-600 text-white" : "bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white"}`}
                        title="Toggle Grid"
                      >
                        <Grid3X3 className="w-3 h-3" />
                      </button>
                      <div className="w-px h-5 bg-cyan-600/30" />
                      <button
                        onClick={handleZoomOut}
                        className="p-1.5 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                        title="Zoom Out"
                      >
                        <ZoomOut className="w-3 h-3" />
                      </button>
                      <span className="text-cyan-300 text-[9px] font-mono w-7 text-center">
                        {mapScale === 1 ? "1X" : mapScale === 1.25 ? "1.25" : mapScale === 1.5 ? "1.5" : "1.75"}
                      </span>
                      <button
                        onClick={handleZoomIn}
                        className="p-1.5 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                        title="Zoom In"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Navigation Pad - compact */}
                    <div className="flex flex-col items-center gap-0.5 bg-[#0d1a2d]/90 rounded-lg p-1 border border-cyan-600/50">
                      <button
                        onClick={() => handlePan("up")}
                        className="p-1 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <div className="flex gap-0.5">
                        <button
                          onClick={() => handlePan("left")}
                          className="p-1 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <div className="w-5 h-5 rounded bg-[#1a2a3d] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                        </div>
                        <button
                          onClick={() => handlePan("right")}
                          className="p-1 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => handlePan("down")}
                        className="p-1 rounded bg-[#1a2a3d] text-cyan-400 hover:bg-cyan-700 hover:text-white transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT - Messages/Team/Vehicles Panel (25%) */}
          {/* CHANGED panel from 1/4 to 1/3 width and added new props */}
          <div className="hidden md:flex md:w-1/3 flex-shrink-0">
            <MessagesPanel
              messages={SAMPLE_MESSAGES}
              characters={SAMPLE_CHARACTERS}
              onCharacterClick={handleTeamCharacterClick}
              selectedCell={selectedCell}
              isTopPanel={false}
              gameTime={currentTime}
              gameDay={currentDay}
              gameYear={currentYear}
              dayOfWeek={dayOfWeek}
              timeOfDay={timeOfDay}
              isPaused={isTimePaused}
              timeSpeed={timeSpeed}
              onTogglePause={handleTogglePause}
              onSpeedChange={handleSpeedChange}
              onShowPhone={() => setShowPhone(!showPhone)}
              onShowLaptop={() => setShowLaptop(!showLaptop)}
              onShowSettings={() => setShowGridColorPicker(!showGridColorPicker)}
              showPhone={showPhone}
              showLaptop={showLaptop}
            />
          </div>
        </div>

        {/* Mobile Panel Overlay */}
        {mobilePanel === "comms" && (
          <div className="md:hidden absolute inset-x-2 bottom-2 top-auto max-h-[60vh] bg-[#0d1a2d] border-2 border-cyan-600/30 rounded-lg overflow-hidden z-30">
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-cyan-700 to-cyan-900 border-b border-cyan-600/50">
              <span className="text-cyan-100 font-bold text-sm uppercase tracking-wide">Panel</span>
              <button onClick={() => setMobilePanel(null)} className="text-white hover:text-red-400 text-lg">
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(60vh-40px)]">
              <MessagesPanel
                messages={SAMPLE_MESSAGES}
                characters={SAMPLE_CHARACTERS}
                onCharacterClick={handleTeamCharacterClick}
                selectedCell={selectedCell}
                isTopPanel={false}
              />
            </div>
          </div>
        )}

        {showPhone && (
          <MobilePhone
            isOpen={showPhone}
            onClose={() => setShowPhone(false)}
            gameTime={new Date()}
            gameDay={currentDay}
            gameYear={currentYear}
            onNavigateToSector={handleCellClick}
            onSelectSector={setSelectedCell}
          />
        )}

        {showLaptop && (
          <LaptopUI
            isOpen={showLaptop}
            onClose={handleCloseLaptop}
            gameTime={new Date()}
            gameDay={currentDay}
            gameYear={currentYear}
          />
        )}

        {showCharacterScreen && (
          <CharacterScreen
            initialCharacter={SAMPLE_FULL_CHARACTERS[selectedCharacterIndex]}
            onClose={() => setShowCharacterScreen(false)}
            onSave={(character) => {
              console.log("Saved character:", character)
              setShowCharacterScreen(false)
            }}
          />
        )}

        {showCitySelection && selectedCountry && (
          <CitySelection
            country={selectedCountry}
            cities={countryCities}
            onSelectCity={handleCitySelect}
            onClose={() => setShowCitySelection(false)}
          />
        )}

        {showCountryInfo && selectedCountry && (
          <CountryInfoModal
            country={selectedCountry}
            cities={countryCities}
            onClose={() => setShowCountryInfo(false)}
            onSelect={handleSelectFromCountryInfo}
            onOpenCities={handleOpenCities}
          />
        )}
      </div>
    </div>
  )
}
