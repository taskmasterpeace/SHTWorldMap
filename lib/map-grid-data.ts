// Map grid data with region information for each cell
export interface GridCell {
  id: string
  row: number
  col: number
  region: string
  subRegion?: string
  countries?: string[]
  climate?: string
  terrain?: string
  threats?: number
  allies?: number
  bases?: number
  notes?: string
}

export const GRID_COLS = 40
export const GRID_ROWS = 24

// Region definitions for different areas of the map
const REGIONS: Record<string, Omit<GridCell, "id" | "row" | "col">> = {
  arctic_ocean: { region: "Arctic Ocean", climate: "Polar", terrain: "Ice Sheets", threats: 0, allies: 0, bases: 0 },
  greenland: {
    region: "Greenland",
    countries: ["Denmark"],
    climate: "Polar",
    terrain: "Ice Cap",
    threats: 0,
    allies: 1,
    bases: 0,
  },
  arctic_canada: {
    region: "Arctic Canada",
    countries: ["Canada"],
    climate: "Polar",
    terrain: "Tundra",
    threats: 1,
    allies: 2,
    bases: 1,
  },
  alaska: {
    region: "Alaska",
    countries: ["USA"],
    climate: "Subarctic",
    terrain: "Tundra/Mountains",
    threats: 1,
    allies: 4,
    bases: 2,
  },
  western_canada: {
    region: "Western Canada",
    countries: ["Canada"],
    climate: "Temperate",
    terrain: "Mountains/Forest",
    threats: 2,
    allies: 5,
    bases: 1,
  },
  eastern_canada: {
    region: "Eastern Canada",
    countries: ["Canada"],
    climate: "Continental",
    terrain: "Forest/Lakes",
    threats: 3,
    allies: 6,
    bases: 2,
  },
  pacific_northwest: {
    region: "Pacific Northwest",
    countries: ["USA"],
    climate: "Temperate",
    terrain: "Mountains/Coast",
    threats: 2,
    allies: 5,
    bases: 2,
  },
  western_usa: {
    region: "Western USA",
    countries: ["USA"],
    climate: "Varied",
    terrain: "Mountains/Desert",
    threats: 3,
    allies: 6,
    bases: 3,
  },
  central_usa: {
    region: "Central USA",
    countries: ["USA"],
    climate: "Continental",
    terrain: "Plains",
    threats: 3,
    allies: 6,
    bases: 3,
  },
  eastern_usa: {
    region: "Eastern USA",
    countries: ["USA"],
    climate: "Humid Subtropical",
    terrain: "Coast/Urban",
    threats: 5,
    allies: 8,
    bases: 4,
  },
  mexico: {
    region: "Mexico",
    countries: ["Mexico"],
    climate: "Tropical",
    terrain: "Mountains/Desert",
    threats: 4,
    allies: 3,
    bases: 1,
  },
  central_america: {
    region: "Central America",
    countries: ["Guatemala", "Honduras", "Nicaragua", "Costa Rica", "Panama"],
    climate: "Tropical",
    terrain: "Jungle",
    threats: 3,
    allies: 2,
    bases: 1,
  },
  caribbean: {
    region: "Caribbean",
    countries: ["Cuba", "Jamaica", "Haiti", "Dominican Republic", "Puerto Rico"],
    climate: "Tropical",
    terrain: "Islands",
    threats: 3,
    allies: 2,
    bases: 1,
  },
  venezuela: {
    region: "Venezuela",
    countries: ["Venezuela", "Guyana", "Suriname"],
    climate: "Tropical",
    terrain: "Jungle/Coast",
    threats: 5,
    allies: 2,
    bases: 0,
  },
  colombia: {
    region: "Colombia",
    countries: ["Colombia", "Ecuador"],
    climate: "Tropical",
    terrain: "Jungle/Mountains",
    threats: 5,
    allies: 3,
    bases: 1,
  },
  brazil_north: {
    region: "Northern Brazil",
    subRegion: "Amazon Basin",
    countries: ["Brazil"],
    climate: "Tropical",
    terrain: "Rainforest",
    threats: 4,
    allies: 3,
    bases: 1,
  },
  brazil_south: {
    region: "Southern Brazil",
    countries: ["Brazil"],
    climate: "Subtropical",
    terrain: "Coast/Plains",
    threats: 3,
    allies: 4,
    bases: 2,
  },
  peru: {
    region: "Peru",
    countries: ["Peru", "Bolivia"],
    climate: "Varied",
    terrain: "Andes/Coast",
    threats: 3,
    allies: 2,
    bases: 1,
  },
  argentina: {
    region: "Argentina",
    countries: ["Argentina", "Uruguay", "Paraguay"],
    climate: "Temperate",
    terrain: "Pampas/Patagonia",
    threats: 2,
    allies: 3,
    bases: 1,
  },
  chile: {
    region: "Chile",
    countries: ["Chile"],
    climate: "Varied",
    terrain: "Mountains/Coast",
    threats: 1,
    allies: 2,
    bases: 1,
  },
  north_atlantic: {
    region: "North Atlantic Ocean",
    climate: "Maritime",
    terrain: "Ocean",
    threats: 1,
    allies: 0,
    bases: 0,
  },
  central_atlantic: {
    region: "Central Atlantic Ocean",
    climate: "Subtropical",
    terrain: "Ocean",
    threats: 1,
    allies: 0,
    bases: 0,
  },
  south_atlantic: {
    region: "South Atlantic Ocean",
    climate: "Temperate",
    terrain: "Ocean",
    threats: 0,
    allies: 0,
    bases: 0,
  },
  north_pacific: {
    region: "North Pacific Ocean",
    climate: "Temperate",
    terrain: "Ocean",
    threats: 1,
    allies: 0,
    bases: 0,
  },
  central_pacific: {
    region: "Central Pacific Ocean",
    climate: "Tropical",
    terrain: "Ocean",
    threats: 1,
    allies: 0,
    bases: 0,
  },
  south_pacific: {
    region: "South Pacific Ocean",
    climate: "Temperate",
    terrain: "Ocean",
    threats: 0,
    allies: 0,
    bases: 0,
  },
  iceland: {
    region: "Iceland",
    countries: ["Iceland"],
    climate: "Subarctic",
    terrain: "Volcanic Island",
    threats: 1,
    allies: 3,
    bases: 1,
  },
  british_isles: {
    region: "British Isles",
    countries: ["UK", "Ireland"],
    climate: "Maritime",
    terrain: "Islands",
    threats: 4,
    allies: 8,
    bases: 3,
  },
  france: {
    region: "France",
    countries: ["France", "Belgium", "Netherlands"],
    climate: "Temperate",
    terrain: "Plains/Coast",
    threats: 3,
    allies: 7,
    bases: 2,
  },
  iberia: {
    region: "Iberian Peninsula",
    countries: ["Spain", "Portugal"],
    climate: "Mediterranean",
    terrain: "Mountains/Coast",
    threats: 2,
    allies: 5,
    bases: 2,
  },
  germany: {
    region: "Central Europe",
    countries: ["Germany", "Poland", "Czech Republic", "Austria", "Switzerland"],
    climate: "Temperate",
    terrain: "Plains/Forest",
    threats: 3,
    allies: 8,
    bases: 3,
  },
  italy: {
    region: "Italy",
    countries: ["Italy"],
    climate: "Mediterranean",
    terrain: "Peninsula/Mountains",
    threats: 3,
    allies: 6,
    bases: 2,
  },
  scandinavia: {
    region: "Scandinavia",
    countries: ["Norway", "Sweden", "Denmark"],
    climate: "Subarctic",
    terrain: "Forest/Mountains",
    threats: 2,
    allies: 7,
    bases: 2,
  },
  finland: {
    region: "Finland & Baltics",
    countries: ["Finland", "Estonia", "Latvia", "Lithuania"],
    climate: "Subarctic",
    terrain: "Forest/Lakes",
    threats: 3,
    allies: 5,
    bases: 1,
  },
  eastern_europe: {
    region: "Eastern Europe",
    countries: ["Ukraine", "Belarus", "Moldova"],
    climate: "Continental",
    terrain: "Plains",
    threats: 6,
    allies: 5,
    bases: 2,
  },
  balkans: {
    region: "Balkans",
    countries: ["Greece", "Serbia", "Bulgaria", "Romania", "Croatia"],
    climate: "Mediterranean",
    terrain: "Mountains",
    threats: 4,
    allies: 4,
    bases: 1,
  },
  western_russia: {
    region: "Western Russia",
    countries: ["Russia"],
    climate: "Continental",
    terrain: "Plains",
    threats: 6,
    allies: 1,
    bases: 0,
  },
  central_russia: {
    region: "Central Russia",
    subRegion: "Ural Region",
    countries: ["Russia"],
    climate: "Continental",
    terrain: "Taiga",
    threats: 4,
    allies: 0,
    bases: 0,
  },
  siberia: {
    region: "Siberia",
    countries: ["Russia"],
    climate: "Subarctic",
    terrain: "Taiga/Tundra",
    threats: 2,
    allies: 0,
    bases: 0,
  },
  russian_far_east: {
    region: "Russian Far East",
    countries: ["Russia"],
    climate: "Subarctic",
    terrain: "Mountains/Coast",
    threats: 4,
    allies: 0,
    bases: 0,
  },
  morocco: {
    region: "Morocco",
    countries: ["Morocco", "Western Sahara"],
    climate: "Arid",
    terrain: "Desert/Coast",
    threats: 3,
    allies: 3,
    bases: 1,
  },
  algeria: {
    region: "Algeria",
    countries: ["Algeria", "Tunisia"],
    climate: "Arid",
    terrain: "Desert/Coast",
    threats: 4,
    allies: 2,
    bases: 1,
  },
  libya: {
    region: "Libya",
    countries: ["Libya"],
    climate: "Arid",
    terrain: "Desert",
    threats: 5,
    allies: 1,
    bases: 0,
  },
  egypt: {
    region: "Egypt",
    countries: ["Egypt"],
    climate: "Arid",
    terrain: "Desert/Nile Valley",
    threats: 4,
    allies: 4,
    bases: 2,
  },
  sahara: {
    region: "Sahara Desert",
    countries: ["Mali", "Niger", "Chad", "Mauritania"],
    climate: "Arid",
    terrain: "Desert",
    threats: 3,
    allies: 1,
    bases: 0,
  },
  west_africa: {
    region: "West Africa",
    countries: ["Nigeria", "Ghana", "Senegal", "Ivory Coast", "Cameroon"],
    climate: "Tropical",
    terrain: "Savanna/Coast",
    threats: 5,
    allies: 2,
    bases: 1,
  },
  central_africa: {
    region: "Central Africa",
    countries: ["DRC", "Congo", "Central African Republic", "Gabon"],
    climate: "Tropical",
    terrain: "Rainforest",
    threats: 6,
    allies: 2,
    bases: 1,
  },
  sudan: {
    region: "Sudan",
    countries: ["Sudan", "South Sudan"],
    climate: "Tropical/Arid",
    terrain: "Savanna/Desert",
    threats: 6,
    allies: 1,
    bases: 0,
  },
  ethiopia: {
    region: "Horn of Africa",
    countries: ["Ethiopia", "Somalia", "Eritrea", "Djibouti"],
    climate: "Tropical/Arid",
    terrain: "Highlands/Desert",
    threats: 5,
    allies: 2,
    bases: 1,
  },
  east_africa: {
    region: "East Africa",
    countries: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
    climate: "Tropical",
    terrain: "Savanna/Lakes",
    threats: 4,
    allies: 3,
    bases: 2,
  },
  angola: {
    region: "Angola & Zambia",
    countries: ["Angola", "Zambia", "Zimbabwe"],
    climate: "Tropical",
    terrain: "Savanna/Plateau",
    threats: 4,
    allies: 2,
    bases: 1,
  },
  southern_africa: {
    region: "Southern Africa",
    countries: ["South Africa", "Namibia", "Botswana", "Mozambique"],
    climate: "Varied",
    terrain: "Desert/Savanna",
    threats: 3,
    allies: 4,
    bases: 2,
  },
  madagascar: {
    region: "Madagascar",
    countries: ["Madagascar"],
    climate: "Tropical",
    terrain: "Island",
    threats: 2,
    allies: 2,
    bases: 1,
  },
  saudi_arabia: {
    region: "Saudi Arabia",
    countries: ["Saudi Arabia", "Yemen", "Oman"],
    climate: "Arid",
    terrain: "Desert",
    threats: 6,
    allies: 3,
    bases: 2,
  },
  iraq: {
    region: "Iraq & Syria",
    countries: ["Iraq", "Syria"],
    climate: "Arid",
    terrain: "Desert/River Valley",
    threats: 8,
    allies: 2,
    bases: 1,
  },
  iran: {
    region: "Iran",
    countries: ["Iran"],
    climate: "Arid",
    terrain: "Mountains/Desert",
    threats: 7,
    allies: 1,
    bases: 0,
  },
  israel: {
    region: "Israel & Levant",
    countries: ["Israel", "Jordan", "Lebanon"],
    climate: "Mediterranean",
    terrain: "Coast/Desert",
    threats: 6,
    allies: 5,
    bases: 2,
  },
  turkey: {
    region: "Turkey",
    countries: ["Turkey"],
    climate: "Mediterranean",
    terrain: "Mountains/Plateau",
    threats: 4,
    allies: 5,
    bases: 2,
  },
  caucasus: {
    region: "Caucasus",
    countries: ["Georgia", "Armenia", "Azerbaijan"],
    climate: "Continental",
    terrain: "Mountains",
    threats: 5,
    allies: 2,
    bases: 1,
  },
  central_asia: {
    region: "Central Asia",
    countries: ["Kazakhstan", "Uzbekistan", "Turkmenistan", "Tajikistan", "Kyrgyzstan"],
    climate: "Arid",
    terrain: "Steppe/Desert",
    threats: 4,
    allies: 2,
    bases: 1,
  },
  afghanistan: {
    region: "Afghanistan",
    countries: ["Afghanistan"],
    climate: "Arid",
    terrain: "Mountains",
    threats: 8,
    allies: 2,
    bases: 1,
  },
  pakistan: {
    region: "Pakistan",
    countries: ["Pakistan"],
    climate: "Arid",
    terrain: "Mountains/Plains",
    threats: 6,
    allies: 3,
    bases: 1,
  },
  india_north: {
    region: "Northern India",
    countries: ["India"],
    climate: "Varied",
    terrain: "Himalayas/Plains",
    threats: 4,
    allies: 5,
    bases: 2,
  },
  india_south: {
    region: "Southern India",
    countries: ["India", "Sri Lanka"],
    climate: "Tropical",
    terrain: "Peninsula/Coast",
    threats: 3,
    allies: 4,
    bases: 2,
  },
  bangladesh: {
    region: "Bangladesh & Myanmar",
    countries: ["Bangladesh", "Myanmar"],
    climate: "Tropical",
    terrain: "Delta/Jungle",
    threats: 4,
    allies: 2,
    bases: 1,
  },
  tibet: {
    region: "Tibet",
    countries: ["China"],
    climate: "Alpine",
    terrain: "Plateau/Mountains",
    threats: 2,
    allies: 0,
    bases: 0,
  },
  western_china: {
    region: "Western China",
    subRegion: "Xinjiang",
    countries: ["China"],
    climate: "Arid",
    terrain: "Desert/Mountains",
    threats: 5,
    allies: 0,
    bases: 0,
  },
  northern_china: {
    region: "Northern China",
    countries: ["China"],
    climate: "Continental",
    terrain: "Plains/Desert",
    threats: 5,
    allies: 1,
    bases: 0,
  },
  eastern_china: {
    region: "Eastern China",
    countries: ["China"],
    climate: "Temperate",
    terrain: "Coast/Plains",
    threats: 7,
    allies: 1,
    bases: 0,
  },
  southern_china: {
    region: "Southern China",
    countries: ["China"],
    climate: "Subtropical",
    terrain: "Hills/Coast",
    threats: 5,
    allies: 2,
    bases: 1,
  },
  mongolia: {
    region: "Mongolia",
    countries: ["Mongolia"],
    climate: "Continental",
    terrain: "Steppe/Desert",
    threats: 2,
    allies: 1,
    bases: 0,
  },
  thailand: {
    region: "Thailand & Indochina",
    countries: ["Thailand", "Cambodia", "Laos"],
    climate: "Tropical",
    terrain: "Jungle/Plains",
    threats: 3,
    allies: 4,
    bases: 2,
  },
  vietnam: {
    region: "Vietnam",
    countries: ["Vietnam"],
    climate: "Tropical",
    terrain: "Jungle/Coast",
    threats: 3,
    allies: 3,
    bases: 1,
  },
  malaysia: {
    region: "Malaysia & Singapore",
    countries: ["Malaysia", "Singapore"],
    climate: "Tropical",
    terrain: "Jungle/Coast",
    threats: 2,
    allies: 4,
    bases: 2,
  },
  indonesia: {
    region: "Indonesia",
    countries: ["Indonesia"],
    climate: "Tropical",
    terrain: "Islands",
    threats: 3,
    allies: 2,
    bases: 1,
  },
  philippines: {
    region: "Philippines",
    countries: ["Philippines"],
    climate: "Tropical",
    terrain: "Islands",
    threats: 3,
    allies: 4,
    bases: 2,
  },
  taiwan: {
    region: "Taiwan",
    countries: ["Taiwan"],
    climate: "Subtropical",
    terrain: "Island",
    threats: 4,
    allies: 5,
    bases: 2,
  },
  japan: {
    region: "Japan",
    countries: ["Japan"],
    climate: "Temperate",
    terrain: "Islands",
    threats: 3,
    allies: 7,
    bases: 4,
  },
  korea: {
    region: "Korean Peninsula",
    countries: ["South Korea", "North Korea"],
    climate: "Temperate",
    terrain: "Peninsula",
    threats: 6,
    allies: 5,
    bases: 2,
  },
  australia_north: {
    region: "Northern Australia",
    countries: ["Australia"],
    climate: "Tropical",
    terrain: "Desert/Outback",
    threats: 1,
    allies: 3,
    bases: 1,
  },
  australia_west: {
    region: "Western Australia",
    countries: ["Australia"],
    climate: "Arid",
    terrain: "Desert/Coast",
    threats: 1,
    allies: 4,
    bases: 2,
  },
  australia_east: {
    region: "Eastern Australia",
    countries: ["Australia"],
    climate: "Temperate",
    terrain: "Coast/Outback",
    threats: 2,
    allies: 5,
    bases: 3,
  },
  new_zealand: {
    region: "New Zealand",
    countries: ["New Zealand"],
    climate: "Temperate",
    terrain: "Islands",
    threats: 1,
    allies: 4,
    bases: 2,
  },
  papua_new_guinea: {
    region: "Papua New Guinea",
    countries: ["Papua New Guinea"],
    climate: "Tropical",
    terrain: "Jungle/Mountains",
    threats: 2,
    allies: 1,
    bases: 0,
  },
  pacific_islands: {
    region: "Pacific Islands",
    countries: ["Fiji", "Samoa", "Tonga", "Various"],
    climate: "Tropical",
    terrain: "Islands/Ocean",
    threats: 1,
    allies: 1,
    bases: 0,
  },
  hawaii: {
    region: "Hawaii",
    countries: ["USA"],
    climate: "Tropical",
    terrain: "Islands",
    threats: 1,
    allies: 5,
    bases: 3,
  },
  indian_ocean: { region: "Indian Ocean", climate: "Tropical", terrain: "Ocean", threats: 2, allies: 1, bases: 0 },
  southern_ocean: { region: "Southern Ocean", climate: "Polar", terrain: "Ocean/Ice", threats: 0, allies: 0, bases: 0 },
  antarctica: { region: "Antarctica", climate: "Polar", terrain: "Ice", threats: 0, allies: 1, bases: 1 },
}

function getRegionForCell(row: number, col: number): Omit<GridCell, "id" | "row" | "col"> {
  // Normalize to percentages for easier mapping (based on standard world map projection)
  const x = col / GRID_COLS // 0-1 left to right (180W to 180E)
  const y = row / GRID_ROWS // 0-1 top to bottom (90N to 90S)

  // Row 0-2: Arctic (top ~12.5%)
  if (y < 0.125) {
    if (x < 0.05) return REGIONS.arctic_ocean // Bering Strait area
    if (x < 0.12) return REGIONS.alaska
    if (x < 0.22) return REGIONS.arctic_canada
    if (x < 0.32) return REGIONS.arctic_canada
    if (x < 0.4) return REGIONS.greenland
    if (x < 0.48) return REGIONS.iceland
    if (x < 0.52) return REGIONS.arctic_ocean
    if (x < 0.58) return REGIONS.scandinavia
    if (x < 0.68) return REGIONS.western_russia
    if (x < 0.82) return REGIONS.siberia
    if (x < 0.92) return REGIONS.russian_far_east
    return REGIONS.arctic_ocean
  }

  // Row 3-5: Northern regions (~12.5-25%)
  if (y < 0.25) {
    if (x < 0.05) return REGIONS.north_pacific
    if (x < 0.1) return REGIONS.alaska
    if (x < 0.16) return REGIONS.western_canada
    if (x < 0.22) return REGIONS.eastern_canada
    if (x < 0.28) return REGIONS.eastern_canada
    if (x < 0.35) return REGIONS.north_atlantic
    if (x < 0.4) return REGIONS.greenland
    if (x < 0.45) return REGIONS.iceland
    if (x < 0.48) return REGIONS.british_isles
    if (x < 0.52) return REGIONS.scandinavia
    if (x < 0.58) return REGIONS.finland
    if (x < 0.68) return REGIONS.western_russia
    if (x < 0.78) return REGIONS.central_russia
    if (x < 0.88) return REGIONS.siberia
    if (x < 0.95) return REGIONS.russian_far_east
    return REGIONS.north_pacific
  }

  // Row 6-8: North-mid regions (USA, Europe, Russia, North China) (~25-37.5%)
  if (y < 0.375) {
    if (x < 0.05) return REGIONS.north_pacific
    if (x < 0.1) return REGIONS.pacific_northwest
    if (x < 0.14) return REGIONS.western_usa
    if (x < 0.18) return REGIONS.central_usa
    if (x < 0.24) return REGIONS.eastern_usa
    if (x < 0.35) return REGIONS.north_atlantic
    if (x < 0.4) return REGIONS.north_atlantic
    if (x < 0.44) return REGIONS.british_isles
    if (x < 0.48) return REGIONS.france
    if (x < 0.52) return REGIONS.germany
    if (x < 0.56) return REGIONS.eastern_europe
    if (x < 0.62) return REGIONS.western_russia
    if (x < 0.7) return REGIONS.central_asia
    if (x < 0.76) return REGIONS.mongolia
    if (x < 0.82) return REGIONS.northern_china
    if (x < 0.88) return REGIONS.russian_far_east
    if (x < 0.92) return REGIONS.japan
    return REGIONS.north_pacific
  }

  // Row 9-11: Mid regions (Mexico border, Mediterranean, Middle East, China) (~37.5-50%)
  if (y < 0.5) {
    if (x < 0.05) return REGIONS.north_pacific
    if (x < 0.1) return REGIONS.western_usa
    if (x < 0.14) return REGIONS.mexico
    if (x < 0.2) return REGIONS.mexico
    if (x < 0.26) return REGIONS.caribbean
    if (x < 0.35) return REGIONS.central_atlantic
    if (x < 0.4) return REGIONS.central_atlantic
    if (x < 0.44) return REGIONS.iberia
    if (x < 0.48) return REGIONS.france
    if (x < 0.52) return REGIONS.italy
    if (x < 0.56) return REGIONS.balkans
    if (x < 0.6) return REGIONS.turkey
    if (x < 0.64) return REGIONS.iran
    if (x < 0.7) return REGIONS.afghanistan
    if (x < 0.76) return REGIONS.western_china
    if (x < 0.82) return REGIONS.eastern_china
    if (x < 0.88) return REGIONS.korea
    if (x < 0.92) return REGIONS.japan
    return REGIONS.north_pacific
  }

  // Row 12-14: Tropical North (~50-62.5%)
  if (y < 0.625) {
    if (x < 0.05) return REGIONS.central_pacific
    if (x < 0.1) return REGIONS.mexico
    if (x < 0.15) return REGIONS.central_america
    if (x < 0.2) return REGIONS.caribbean
    if (x < 0.26) return REGIONS.venezuela
    if (x < 0.35) return REGIONS.central_atlantic
    if (x < 0.4) return REGIONS.central_atlantic
    if (x < 0.44) return REGIONS.morocco
    if (x < 0.48) return REGIONS.algeria
    if (x < 0.52) return REGIONS.libya
    if (x < 0.56) return REGIONS.egypt
    if (x < 0.6) return REGIONS.saudi_arabia
    if (x < 0.64) return REGIONS.iraq
    if (x < 0.68) return REGIONS.pakistan
    if (x < 0.72) return REGIONS.india_north
    if (x < 0.78) return REGIONS.bangladesh
    if (x < 0.82) return REGIONS.southern_china
    if (x < 0.86) return REGIONS.vietnam
    if (x < 0.9) return REGIONS.philippines
    if (x < 0.95) return REGIONS.central_pacific
    return REGIONS.hawaii
  }

  // Row 15-17: Tropical South (~62.5-75%)
  if (y < 0.75) {
    if (x < 0.05) return REGIONS.central_pacific
    if (x < 0.1) return REGIONS.central_pacific
    if (x < 0.14) return REGIONS.peru
    if (x < 0.18) return REGIONS.colombia
    if (x < 0.26) return REGIONS.brazil_north
    if (x < 0.32) return REGIONS.brazil_north
    if (x < 0.4) return REGIONS.central_atlantic
    if (x < 0.46) return REGIONS.sahara
    if (x < 0.52) return REGIONS.west_africa
    if (x < 0.58) return REGIONS.central_africa
    if (x < 0.64) return REGIONS.east_africa
    if (x < 0.7) return REGIONS.indian_ocean
    if (x < 0.76) return REGIONS.india_south
    if (x < 0.82) return REGIONS.thailand
    if (x < 0.88) return REGIONS.indonesia
    if (x < 0.94) return REGIONS.papua_new_guinea
    return REGIONS.pacific_islands
  }

  // Row 18-20: Southern regions (~75-87.5%)
  if (y < 0.875) {
    if (x < 0.05) return REGIONS.south_pacific
    if (x < 0.1) return REGIONS.south_pacific
    if (x < 0.14) return REGIONS.chile
    if (x < 0.18) return REGIONS.argentina
    if (x < 0.24) return REGIONS.argentina
    if (x < 0.3) return REGIONS.brazil_south
    if (x < 0.4) return REGIONS.south_atlantic
    if (x < 0.5) return REGIONS.south_atlantic
    if (x < 0.56) return REGIONS.angola
    if (x < 0.62) return REGIONS.southern_africa
    if (x < 0.68) return REGIONS.madagascar
    if (x < 0.76) return REGIONS.indian_ocean
    if (x < 0.84) return REGIONS.australia_west
    if (x < 0.9) return REGIONS.australia_east
    if (x < 0.96) return REGIONS.new_zealand
    return REGIONS.south_pacific
  }

  // Row 21-23: Far South/Antarctica approach (~87.5-100%)
  if (x < 0.15) return REGIONS.southern_ocean
  if (x < 0.25) return REGIONS.chile
  if (x < 0.4) return REGIONS.south_atlantic
  if (x < 0.6) return REGIONS.southern_ocean
  if (x < 0.75) return REGIONS.southern_ocean
  if (x < 0.9) return REGIONS.australia_east
  return REGIONS.southern_ocean
}

// Generate the 40x24 grid
function generateGrid(): GridCell[] {
  const grid: GridCell[] = []
  const rowLabels = "ABCDEFGHIJKLMNOPQRSTUVWX" // 24 rows

  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const id = `${rowLabels[row]}${col + 1}`
      const regionData = getRegionForCell(row, col)
      grid.push({
        id,
        row,
        col,
        ...regionData,
      })
    }
  }

  return grid
}

export const MAP_GRID = generateGrid()

export const getGridCell = (row: number, col: number): GridCell | undefined => {
  return MAP_GRID.find((cell) => cell.row === row && cell.col === col)
}

export const getGridCellById = (id: string): GridCell | undefined => {
  return MAP_GRID.find((cell) => cell.id === id)
}
