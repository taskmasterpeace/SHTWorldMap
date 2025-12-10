// Comprehensive sector data system for assigning information to each grid cell
// Sectors are identified by their grid coordinates (A1 through X40)

export type TerrainType =
  | "ocean"
  | "ice"
  | "tundra"
  | "forest"
  | "plains"
  | "desert"
  | "mountains"
  | "jungle"
  | "swamp"
  | "urban"
  | "coastal"
  | "islands"

export type TravelMethod = "ground" | "air" | "sea" | "submarine"

// Travel speed modifiers by terrain (1.0 = normal, lower = slower, higher = faster)
export const TERRAIN_SPEED_MODIFIERS: Record<TerrainType, Record<TravelMethod, number>> = {
  ocean: { ground: 0, air: 1.2, sea: 1.0, submarine: 1.0 },
  ice: { ground: 0.3, air: 1.0, sea: 0.4, submarine: 0.8 },
  tundra: { ground: 0.5, air: 1.0, sea: 0, submarine: 0 },
  forest: { ground: 0.6, air: 0.9, sea: 0, submarine: 0 },
  plains: { ground: 1.0, air: 1.0, sea: 0, submarine: 0 },
  desert: { ground: 0.7, air: 1.0, sea: 0, submarine: 0 },
  mountains: { ground: 0.3, air: 0.8, sea: 0, submarine: 0 },
  jungle: { ground: 0.4, air: 0.8, sea: 0, submarine: 0 },
  swamp: { ground: 0.3, air: 0.9, sea: 0.5, submarine: 0 },
  urban: { ground: 0.8, air: 1.0, sea: 0, submarine: 0 },
  coastal: { ground: 0.9, air: 1.0, sea: 1.0, submarine: 0.9 },
  islands: { ground: 0.7, air: 1.0, sea: 0.9, submarine: 0.8 },
}

export interface City {
  name: string
  population: number // in millions
  isCapital?: boolean
  hasBase?: boolean
  hasAirport?: boolean
  hasPort?: boolean
  threatLevel: number // 0-10
  coordinates?: { lat: number; lng: number }
}

export interface SectorData {
  id: string // e.g., "A1", "B15", "X40"
  row: string // A-X
  col: number // 1-40
  name: string // Custom name for the sector
  region: string // Geographic region
  country?: string // Primary country
  countries?: string[] // Multiple countries if border sector
  terrain: TerrainType
  secondaryTerrain?: TerrainType
  cities: City[]
  population: number // Total population in millions
  threatLevel: number // 0-10
  allyPresence: number // 0-10
  resourceLevel: number // 0-10
  infrastructure: number // 0-10 (affects ground travel)
  weather?: "clear" | "rain" | "storm" | "snow" | "fog"
  specialFeatures?: string[]
  notes?: string
  isRestricted?: boolean // Cannot enter without permission
  controlledBy?: "allies" | "enemies" | "neutral" | "contested"
}

// Helper to generate sector ID from row letter and column number
export function getSectorId(row: string, col: number): string {
  return `${row}${col}`
}

// Helper to parse sector ID into row and column
export function parseSectorId(id: string | undefined | null): { row: string; col: number } | null {
  if (!id) return null
  const match = id.match(/^([A-X])(\d+)$/)
  if (!match) return null
  return { row: match[1], col: Number.parseInt(match[2]) }
}

// Calculate travel time between two sectors
export function calculateTravelTime(
  fromSector: SectorData,
  toSector: SectorData,
  travelMethod: TravelMethod,
  baseSpeed = 100, // km per hour
): number {
  // Calculate distance (each sector is roughly 500km)
  const rowDiff = Math.abs(fromSector.row.charCodeAt(0) - toSector.row.charCodeAt(0))
  const colDiff = Math.abs(fromSector.col - toSector.col)
  const distance = Math.sqrt(rowDiff * rowDiff + colDiff * colDiff) * 500

  // Get terrain modifier
  const terrainMod = TERRAIN_SPEED_MODIFIERS[toSector.terrain][travelMethod]
  if (terrainMod === 0) return Number.POSITIVE_INFINITY // Cannot travel this way

  // Infrastructure bonus for ground travel
  const infraBonus = travelMethod === "ground" ? 1 + toSector.infrastructure / 20 : 1

  // City density slows ground travel but provides more stops
  const cityMod = travelMethod === "ground" ? 1 - toSector.cities.length * 0.05 : 1

  const effectiveSpeed = baseSpeed * terrainMod * infraBonus * Math.max(cityMod, 0.5)

  return distance / effectiveSpeed // Returns hours
}

// Get adjacent sectors
export function getAdjacentSectors(sectorId: string): string[] {
  const parsed = parseSectorId(sectorId)
  if (!parsed) return []

  const { row, col } = parsed
  const rowIndex = row.charCodeAt(0) - 65 // A=0, B=1, etc.
  const adjacent: string[] = []

  // Check all 8 directions
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue // Skip self

      const newRowIndex = rowIndex + dr
      const newCol = col + dc

      // Check bounds (A-X = 0-23, 1-40)
      if (newRowIndex >= 0 && newRowIndex <= 23 && newCol >= 1 && newCol <= 40) {
        const newRow = String.fromCharCode(65 + newRowIndex)
        adjacent.push(getSectorId(newRow, newCol))
      }
    }
  }

  return adjacent
}

// Initialize all 960 sectors (24 rows x 40 cols) with default data
export function initializeSectorData(): Map<string, SectorData> {
  const sectors = new Map<string, SectorData>()

  for (let rowIndex = 0; rowIndex < 24; rowIndex++) {
    const row = String.fromCharCode(65 + rowIndex) // A-X
    for (let col = 1; col <= 40; col++) {
      const id = getSectorId(row, col)
      sectors.set(id, {
        id,
        row,
        col,
        name: `Sector ${id}`,
        region: "Unassigned",
        terrain: "ocean", // Default to ocean, will be overwritten
        cities: [],
        population: 0,
        threatLevel: 0,
        allyPresence: 0,
        resourceLevel: 0,
        infrastructure: 0,
        controlledBy: "neutral",
      })
    }
  }

  return sectors
}

// Sample sector data for key locations - this would be expanded with real data
export const SECTOR_DATABASE: Partial<Record<string, Partial<SectorData>>> = {
  // North America
  D8: {
    name: "Pacific Northwest",
    region: "North America",
    country: "USA",
    terrain: "coastal",
    secondaryTerrain: "forest",
    cities: [
      { name: "Seattle", population: 3.5, hasAirport: true, hasPort: true, threatLevel: 3 },
      { name: "Portland", population: 2.5, hasAirport: true, hasPort: true, threatLevel: 2 },
    ],
    population: 8,
    threatLevel: 3,
    allyPresence: 7,
    resourceLevel: 6,
    infrastructure: 9,
    controlledBy: "allies",
  },
  E9: {
    name: "Northern California",
    region: "North America",
    country: "USA",
    terrain: "coastal",
    cities: [
      { name: "San Francisco", population: 4.7, hasAirport: true, hasPort: true, threatLevel: 4, isCapital: false },
      { name: "Sacramento", population: 2.3, hasAirport: true, threatLevel: 2, isCapital: true },
    ],
    population: 15,
    threatLevel: 4,
    allyPresence: 8,
    resourceLevel: 7,
    infrastructure: 9,
    controlledBy: "allies",
  },
  F9: {
    name: "Southern California",
    region: "North America",
    country: "USA",
    terrain: "coastal",
    secondaryTerrain: "desert",
    cities: [
      { name: "Los Angeles", population: 13, hasAirport: true, hasPort: true, threatLevel: 6 },
      { name: "San Diego", population: 3.3, hasAirport: true, hasPort: true, hasBase: true, threatLevel: 3 },
    ],
    population: 25,
    threatLevel: 6,
    allyPresence: 7,
    resourceLevel: 5,
    infrastructure: 9,
    controlledBy: "allies",
  },
  E12: {
    name: "Great Lakes East",
    region: "North America",
    country: "USA",
    terrain: "urban",
    secondaryTerrain: "plains",
    cities: [
      { name: "Chicago", population: 9.5, hasAirport: true, hasPort: true, threatLevel: 5 },
      { name: "Detroit", population: 4.3, hasAirport: true, threatLevel: 4 },
    ],
    population: 20,
    threatLevel: 5,
    allyPresence: 6,
    resourceLevel: 7,
    infrastructure: 8,
    controlledBy: "allies",
  },
  E14: {
    name: "Northeast Corridor",
    region: "North America",
    country: "USA",
    terrain: "urban",
    cities: [
      { name: "New York City", population: 20, hasAirport: true, hasPort: true, threatLevel: 8 },
      { name: "Philadelphia", population: 6, hasAirport: true, hasPort: true, threatLevel: 5 },
      { name: "Boston", population: 4.9, hasAirport: true, hasPort: true, threatLevel: 4 },
    ],
    population: 45,
    threatLevel: 8,
    allyPresence: 9,
    resourceLevel: 8,
    infrastructure: 10,
    controlledBy: "allies",
    specialFeatures: ["UN Headquarters", "Major Financial Center"],
  },
  F14: {
    name: "Mid-Atlantic",
    region: "North America",
    country: "USA",
    terrain: "urban",
    secondaryTerrain: "coastal",
    cities: [
      { name: "Washington D.C.", population: 6, hasAirport: true, hasBase: true, threatLevel: 7, isCapital: true },
      { name: "Baltimore", population: 2.8, hasAirport: true, hasPort: true, threatLevel: 4 },
    ],
    population: 12,
    threatLevel: 7,
    allyPresence: 10,
    resourceLevel: 6,
    infrastructure: 10,
    controlledBy: "allies",
    specialFeatures: ["US Capital", "Pentagon", "Major Intelligence Hub"],
  },
  // Europe
  D21: {
    name: "British Isles",
    region: "Europe",
    country: "United Kingdom",
    terrain: "islands",
    cities: [
      { name: "London", population: 9, hasAirport: true, hasPort: true, threatLevel: 6, isCapital: true },
      { name: "Manchester", population: 2.8, hasAirport: true, threatLevel: 3 },
      { name: "Birmingham", population: 2.6, hasAirport: true, threatLevel: 3 },
    ],
    population: 67,
    threatLevel: 6,
    allyPresence: 9,
    resourceLevel: 6,
    infrastructure: 9,
    controlledBy: "allies",
  },
  E22: {
    name: "Western Europe",
    region: "Europe",
    countries: ["France", "Belgium", "Netherlands"],
    terrain: "urban",
    secondaryTerrain: "plains",
    cities: [
      { name: "Paris", population: 12, hasAirport: true, threatLevel: 5, isCapital: true },
      { name: "Brussels", population: 2.1, hasAirport: true, threatLevel: 4 },
      { name: "Amsterdam", population: 2.5, hasAirport: true, hasPort: true, threatLevel: 3 },
    ],
    population: 85,
    threatLevel: 5,
    allyPresence: 8,
    resourceLevel: 7,
    infrastructure: 10,
    controlledBy: "allies",
    specialFeatures: ["NATO HQ", "EU Capital"],
  },
  E24: {
    name: "Central Europe",
    region: "Europe",
    countries: ["Germany", "Poland"],
    terrain: "urban",
    secondaryTerrain: "forest",
    cities: [
      { name: "Berlin", population: 3.6, hasAirport: true, threatLevel: 4, isCapital: true },
      { name: "Munich", population: 1.5, hasAirport: true, threatLevel: 3 },
      { name: "Warsaw", population: 1.8, hasAirport: true, threatLevel: 4, isCapital: true },
    ],
    population: 120,
    threatLevel: 4,
    allyPresence: 8,
    resourceLevel: 8,
    infrastructure: 9,
    controlledBy: "allies",
  },
  // Asia
  F30: {
    name: "Middle East - Gulf",
    region: "Middle East",
    countries: ["UAE", "Qatar", "Bahrain"],
    terrain: "desert",
    secondaryTerrain: "coastal",
    cities: [
      { name: "Dubai", population: 3.4, hasAirport: true, hasPort: true, threatLevel: 4 },
      { name: "Abu Dhabi", population: 1.5, hasAirport: true, hasBase: true, threatLevel: 3, isCapital: true },
      { name: "Doha", population: 2.4, hasAirport: true, hasBase: true, threatLevel: 3, isCapital: true },
    ],
    population: 15,
    threatLevel: 5,
    allyPresence: 7,
    resourceLevel: 10,
    infrastructure: 9,
    controlledBy: "allies",
    specialFeatures: ["Major Oil Hub", "US Military Bases"],
  },
  G33: {
    name: "Indian Subcontinent",
    region: "South Asia",
    country: "India",
    terrain: "urban",
    secondaryTerrain: "plains",
    cities: [
      { name: "Mumbai", population: 21, hasAirport: true, hasPort: true, threatLevel: 5 },
      { name: "Delhi", population: 32, hasAirport: true, threatLevel: 6, isCapital: true },
    ],
    population: 200,
    threatLevel: 6,
    allyPresence: 5,
    resourceLevel: 6,
    infrastructure: 6,
    controlledBy: "neutral",
  },
  F37: {
    name: "East China",
    region: "East Asia",
    country: "China",
    terrain: "urban",
    cities: [
      { name: "Shanghai", population: 28, hasAirport: true, hasPort: true, threatLevel: 7 },
      { name: "Hangzhou", population: 12, hasAirport: true, threatLevel: 5 },
    ],
    population: 150,
    threatLevel: 7,
    allyPresence: 2,
    resourceLevel: 8,
    infrastructure: 9,
    controlledBy: "contested",
  },
  E38: {
    name: "Japan",
    region: "East Asia",
    country: "Japan",
    terrain: "islands",
    secondaryTerrain: "mountains",
    cities: [
      { name: "Tokyo", population: 37, hasAirport: true, hasPort: true, threatLevel: 5, isCapital: true },
      { name: "Osaka", population: 19, hasAirport: true, hasPort: true, threatLevel: 4 },
    ],
    population: 125,
    threatLevel: 5,
    allyPresence: 9,
    resourceLevel: 5,
    infrastructure: 10,
    controlledBy: "allies",
    specialFeatures: ["US Military Bases", "Major Tech Hub"],
  },
  // Oceania
  M36: {
    name: "Eastern Australia",
    region: "Oceania",
    country: "Australia",
    terrain: "coastal",
    secondaryTerrain: "urban",
    cities: [
      { name: "Sydney", population: 5.3, hasAirport: true, hasPort: true, threatLevel: 3 },
      { name: "Melbourne", population: 5, hasAirport: true, hasPort: true, threatLevel: 3 },
      { name: "Brisbane", population: 2.5, hasAirport: true, hasPort: true, threatLevel: 2 },
    ],
    population: 20,
    threatLevel: 3,
    allyPresence: 8,
    resourceLevel: 7,
    infrastructure: 9,
    controlledBy: "allies",
  },
  // South America
  J12: {
    name: "Brazil - Southeast",
    region: "South America",
    country: "Brazil",
    terrain: "urban",
    secondaryTerrain: "jungle",
    cities: [
      { name: "São Paulo", population: 22, hasAirport: true, threatLevel: 6 },
      { name: "Rio de Janeiro", population: 13, hasAirport: true, hasPort: true, threatLevel: 7 },
    ],
    population: 80,
    threatLevel: 6,
    allyPresence: 4,
    resourceLevel: 7,
    infrastructure: 7,
    controlledBy: "neutral",
  },
  // Africa
  H24: {
    name: "North Africa",
    region: "Africa",
    countries: ["Egypt", "Libya"],
    terrain: "desert",
    cities: [
      { name: "Cairo", population: 21, hasAirport: true, threatLevel: 6, isCapital: true },
      { name: "Alexandria", population: 5.2, hasAirport: true, hasPort: true, threatLevel: 5 },
    ],
    population: 110,
    threatLevel: 6,
    allyPresence: 4,
    resourceLevel: 5,
    infrastructure: 5,
    controlledBy: "neutral",
  },
  K26: {
    name: "Central Africa",
    region: "Africa",
    countries: ["DRC", "Congo"],
    terrain: "jungle",
    cities: [{ name: "Kinshasa", population: 17, hasAirport: true, threatLevel: 7, isCapital: true }],
    population: 100,
    threatLevel: 8,
    allyPresence: 2,
    resourceLevel: 9,
    infrastructure: 2,
    controlledBy: "contested",
    specialFeatures: ["Rare Earth Minerals", "Active Conflict Zone"],
  },
}

// Get full sector data with defaults filled in
export function getSectorData(sectorId: string | undefined | null): SectorData | null {
  if (!sectorId) return null

  const parsed = parseSectorId(sectorId)
  if (!parsed) return null

  const { row, col } = parsed
  const customData = SECTOR_DATABASE[sectorId]

  const defaultData: SectorData = {
    id: sectorId,
    row,
    col,
    name: `Sector ${sectorId}`,
    region: "Uncharted",
    terrain: "ocean",
    cities: [],
    population: 0,
    threatLevel: 0,
    allyPresence: 0,
    resourceLevel: 0,
    infrastructure: 0,
    controlledBy: "neutral",
  }

  if (customData) {
    return { ...defaultData, ...customData } as SectorData
  }

  return defaultData
}

// Update sector data
export function updateSectorData(sectorId: string, updates: Partial<SectorData>): void {
  SECTOR_DATABASE[sectorId] = {
    ...SECTOR_DATABASE[sectorId],
    ...updates,
  }
}

// Search sectors by various criteria
export function searchSectors(criteria: {
  region?: string
  country?: string
  terrain?: TerrainType
  minThreatLevel?: number
  maxThreatLevel?: number
  hasCity?: string
  controlledBy?: SectorData["controlledBy"]
}): string[] {
  const results: string[] = []

  for (let rowIndex = 0; rowIndex < 24; rowIndex++) {
    const row = String.fromCharCode(65 + rowIndex)
    for (let col = 1; col <= 40; col++) {
      const id = getSectorId(row, col)
      const sector = getSectorData(id)

      let matches = true

      if (criteria.region && sector.region !== criteria.region) matches = false
      if (criteria.country && sector.country !== criteria.country && !sector.countries?.includes(criteria.country))
        matches = false
      if (criteria.terrain && sector.terrain !== criteria.terrain) matches = false
      if (criteria.minThreatLevel && sector.threatLevel < criteria.minThreatLevel) matches = false
      if (criteria.maxThreatLevel && sector.threatLevel > criteria.maxThreatLevel) matches = false
      if (
        criteria.hasCity &&
        !sector.cities.some((c) => c.name.toLowerCase().includes(criteria.hasCity!.toLowerCase()))
      )
        matches = false
      if (criteria.controlledBy && sector.controlledBy !== criteria.controlledBy) matches = false

      if (matches && SECTOR_DATABASE[id]) {
        results.push(id)
      }
    }
  }

  return results
}
