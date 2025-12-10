// Character Creation Data Types and Constants

export type Team = "heroes" | "villains" | "mercenary" | "civilian"
export type Origin =
  | "skilled_human"
  | "altered_human"
  | "mutant"
  | "tech_enhanced"
  | "mystic"
  | "alien"
  | "construct"
  | "divine"
  | "cosmic"
export type Personality =
  | "aggressive"
  | "calculating"
  | "protective"
  | "sadistic"
  | "tactical"
  | "sniper"
  | "bloodthirsty"
  | "cautious"
  | "berserker"
  | "cold"
  | "opportunist"
  | "honorable"
  | "cunning"
  | "reckless"
  | "methodical"
  | "vengeful"
  | "cowardly"
  | "heroic"
  | "predatory"
  | "professional"

export interface PrimaryStat {
  str: number // Strength
  agl: number // Agility
  end: number // Endurance
  rsn: number // Reasoning
  int: number // Intuition
  psy: number // Psyche
}

export interface SecondaryStat {
  hp: number
  maxAp: number
  movement: number
  initiative: number
  meleeDamageBonus: number
  dodgeBonus: number
  mentalResistance: number
}

export interface Weapon {
  id: string
  name: string
  category: "sidearm" | "rifle" | "energy" | "melee" | "heavy"
  damage: number
  range: number
  apCost: number
  accuracy: number
  armorPen: number
  knockback: number
  ammo?: number
  reload?: number
  soundDb?: number
}

export interface Armor {
  id: string
  name: string
  physicalDr: number
  energyDr: number
  movementPenalty: number
  stealthPenalty: number
  description: string
}

export interface Power {
  id: string
  name: string
  category: "physical" | "energy" | "mental" | "defensive" | "travel" | "alteration"
  description: string
  apCost: number
  charges?: number
  passive?: boolean
}

export interface Gadget {
  id: string
  name: string
  slot: 1 | 2 | 3
  description: string
}

export interface GameCharacter {
  id: string
  name: string
  codename: string
  team: Team
  origin: Origin
  personality: Personality
  secretIdentity: boolean
  backstory: string
  avatar: string

  // Primary stats (point buy)
  primaryStats: PrimaryStat

  // Equipment
  weapon: string | null
  armor: string | null
  gadgets: string[]

  // Powers (based on origin)
  powers: string[]
}

// Origin definitions with bonuses and traits
export const ORIGINS: Record<
  Origin,
  {
    name: string
    emoji: string
    hpMod: number
    trait: string
    immunities: string[]
    vulnerabilities: string[]
    powerCategories: string[]
  }
> = {
  skilled_human: {
    name: "Skilled Human",
    emoji: "🧑",
    hpMod: 0,
    trait: "+10% Accuracy, +5% Evasion",
    immunities: [],
    vulnerabilities: [],
    powerCategories: [],
  },
  altered_human: {
    name: "Altered Human",
    emoji: "🧬",
    hpMod: 10,
    trait: "One enhanced stat (+10)",
    immunities: [],
    vulnerabilities: [],
    powerCategories: ["physical"],
  },
  mutant: {
    name: "Mutant",
    emoji: "🧪",
    hpMod: 5,
    trait: "Random minor power",
    immunities: [],
    vulnerabilities: [],
    powerCategories: ["physical", "energy", "mental", "defensive", "travel", "alteration"],
  },
  tech_enhanced: {
    name: "Tech Enhanced",
    emoji: "🦾",
    hpMod: 20,
    trait: "EMP Vulnerable, +DR",
    immunities: [],
    vulnerabilities: ["EMP"],
    powerCategories: ["physical", "defensive"],
  },
  mystic: {
    name: "Mystic",
    emoji: "🔮",
    hpMod: -10,
    trait: "Energy damage +20%",
    immunities: [],
    vulnerabilities: [],
    powerCategories: ["energy", "mental", "defensive", "alteration"],
  },
  alien: {
    name: "Alien",
    emoji: "👽",
    hpMod: 15,
    trait: "Unusual resistances",
    immunities: [],
    vulnerabilities: [],
    powerCategories: ["physical", "energy", "travel"],
  },
  construct: {
    name: "Construct",
    emoji: "🤖",
    hpMod: 50,
    trait: "Immune: Bleed, Poison, Stun",
    immunities: ["Bleeding", "Burning", "Poison", "Stun"],
    vulnerabilities: ["EMP (+30 damage)"],
    powerCategories: ["physical", "defensive"],
  },
  divine: {
    name: "Divine",
    emoji: "👼",
    hpMod: 10,
    trait: "Immune: Burn, Freeze, Poison",
    immunities: ["Burn", "Freeze", "Poison"],
    vulnerabilities: [],
    powerCategories: ["energy", "defensive", "travel"],
  },
  cosmic: {
    name: "Cosmic",
    emoji: "✨",
    hpMod: 0,
    trait: "Immune: All except EMP",
    immunities: ["All status effects"],
    vulnerabilities: ["EMP"],
    powerCategories: ["physical", "energy", "mental", "defensive", "travel", "alteration"],
  },
}

// Personality definitions
export const PERSONALITIES: Record<
  Personality,
  {
    name: string
    emoji: string
    style: string
    description: string
    targetPriority: string[]
    behaviors: string[]
  }
> = {
  aggressive: {
    name: "Aggressive",
    emoji: "😠",
    style: "Attacks nearest, charges in",
    description: "Rush into combat, prioritize closest enemies",
    targetPriority: ["Nearest enemy", "Lowest defense"],
    behaviors: ["Charges into melee", "Ignores cover"],
  },
  calculating: {
    name: "Calculating",
    emoji: "🧠",
    style: "Optimal target selection",
    description: "Analyzes battlefield for optimal target selection",
    targetPriority: ["Highest threat", "Best opportunity"],
    behaviors: ["Takes cover", "Repositions", "Focus fire"],
  },
  protective: {
    name: "Protective",
    emoji: "🛡️",
    style: "Defends allies, draws fire",
    description: "Shields teammates and draws enemy attention",
    targetPriority: ["Threats to allies", "Flankers"],
    behaviors: ["Stays near allies", "Uses shield abilities"],
  },
  sadistic: {
    name: "Sadistic",
    emoji: "😈",
    style: "Targets wounded, overkill",
    description: "Enjoys inflicting pain, targets the weak",
    targetPriority: ["Wounded enemies", "Isolated targets"],
    behaviors: ["Overkills targets", "Taunts"],
  },
  tactical: {
    name: "Tactical",
    emoji: "🎯",
    style: "Threat prioritization",
    description: "Military-style threat assessment",
    targetPriority: ["High value targets", "Support units"],
    behaviors: ["Coordinates with team", "Uses terrain"],
  },
  sniper: {
    name: "Sniper",
    emoji: "🔭",
    style: "Picks off wounded from range",
    description: "Long-range elimination specialist",
    targetPriority: ["Wounded at range", "High priority"],
    behaviors: ["Maintains distance", "Seeks high ground"],
  },
  bloodthirsty: {
    name: "Bloodthirsty",
    emoji: "🩸",
    style: "Finishes kills, ignores threats",
    description: "Obsessed with securing kills",
    targetPriority: ["Nearly dead", "Previous target"],
    behaviors: ["Chases wounded", "Ignores defense"],
  },
  cautious: {
    name: "Cautious",
    emoji: "😰",
    style: "Stays in cover, retreats when hurt",
    description: "Self-preservation is priority",
    targetPriority: ["Safe targets", "Exposed enemies"],
    behaviors: ["Always in cover", "Retreats at 50% HP"],
  },
  berserker: {
    name: "Berserker",
    emoji: "🔥",
    style: "All-out attack, ignores defense",
    description: "Uncontrollable rage in combat",
    targetPriority: ["Anything nearby", "Last attacker"],
    behaviors: ["Never retreats", "Max damage always"],
  },
  cold: {
    name: "Cold",
    emoji: "🧊",
    style: "Emotionless efficiency",
    description: "No emotion, pure logic",
    targetPriority: ["Most efficient kill", "Tactical value"],
    behaviors: ["No wasted actions", "Calculated risks"],
  },
  opportunist: {
    name: "Opportunist",
    emoji: "🦊",
    style: "Adapts to situation",
    description: "Flexible and adaptive fighter",
    targetPriority: ["Best current opportunity"],
    behaviors: ["Changes tactics", "Exploits openings"],
  },
  honorable: {
    name: "Honorable",
    emoji: "⚔️",
    style: "Fair fights, no cheap shots",
    description: "Follows a warrior's code",
    targetPriority: ["Direct threats", "Equal opponents"],
    behaviors: ["1v1 preference", "No backstabs"],
  },
  cunning: {
    name: "Cunning",
    emoji: "🐍",
    style: "Flanking, ambushes",
    description: "Deceptive and sneaky",
    targetPriority: ["Isolated targets", "Unaware enemies"],
    behaviors: ["Flanks", "Ambushes", "Hit and run"],
  },
  reckless: {
    name: "Reckless",
    emoji: "💀",
    style: "High risk, high reward",
    description: "Takes big risks for big payoffs",
    targetPriority: ["High value risky"],
    behaviors: ["Overextends", "Big plays"],
  },
  methodical: {
    name: "Methodical",
    emoji: "📋",
    style: "Systematic elimination",
    description: "One by one, no mercy",
    targetPriority: ["Nearest to farthest"],
    behaviors: ["Clears systematically", "No skipping"],
  },
  vengeful: {
    name: "Vengeful",
    emoji: "💢",
    style: "Targets whoever hurt them",
    description: "Remembers every slight",
    targetPriority: ["Last attacker", "Most damage dealt"],
    behaviors: ["Fixates on enemies", "Never forgets"],
  },
  cowardly: {
    name: "Cowardly",
    emoji: "🐔",
    style: "Runs when outnumbered",
    description: "Self-preservation above all",
    targetPriority: ["Weakest only"],
    behaviors: ["Flees when losing", "Only safe attacks"],
  },
  heroic: {
    name: "Heroic",
    emoji: "🦸",
    style: "Protects civilians, self-sacrifice",
    description: "Classic hero behavior",
    targetPriority: ["Greatest threat to innocents"],
    behaviors: ["Protects civilians", "Self-sacrifice"],
  },
  predatory: {
    name: "Predatory",
    emoji: "🐺",
    style: "Isolates and hunts weak targets",
    description: "Pack hunter mentality",
    targetPriority: ["Isolated weak", "Stragglers"],
    behaviors: ["Stalks", "Isolates targets"],
  },
  professional: {
    name: "Professional",
    emoji: "💼",
    style: "Efficient, no emotion",
    description: "It's just business",
    targetPriority: ["Mission objective"],
    behaviors: ["Completes objective", "No extras"],
  },
}

// Weapons database
export const WEAPONS: Weapon[] = [
  {
    id: "pistol",
    name: "Pistol",
    category: "sidearm",
    damage: 15,
    range: 6,
    apCost: 2,
    accuracy: 0,
    armorPen: 0,
    knockback: 0,
    ammo: 12,
    reload: 2,
    soundDb: 140,
  },
  {
    id: "smg",
    name: "SMG",
    category: "sidearm",
    damage: 12,
    range: 5,
    apCost: 2,
    accuracy: -1,
    armorPen: 0,
    knockback: 0,
    ammo: 30,
    reload: 2,
    soundDb: 145,
  },
  {
    id: "assault_rifle",
    name: "Assault Rifle",
    category: "rifle",
    damage: 25,
    range: 8,
    apCost: 2,
    accuracy: 0,
    armorPen: 2,
    knockback: 0,
    ammo: 30,
    reload: 3,
    soundDb: 160,
  },
  {
    id: "sniper_rifle",
    name: "Sniper Rifle",
    category: "rifle",
    damage: 45,
    range: 15,
    apCost: 3,
    accuracy: 2,
    armorPen: 4,
    knockback: 1,
    ammo: 5,
    reload: 3,
    soundDb: 170,
  },
  {
    id: "shotgun",
    name: "Shotgun",
    category: "rifle",
    damage: 35,
    range: 4,
    apCost: 2,
    accuracy: -1,
    armorPen: 1,
    knockback: 2,
    ammo: 8,
    reload: 4,
    soundDb: 165,
  },
  {
    id: "beam",
    name: "Beam",
    category: "energy",
    damage: 30,
    range: 10,
    apCost: 3,
    accuracy: 1,
    armorPen: 3,
    knockback: 0,
  },
  {
    id: "plasma_rifle",
    name: "Plasma Rifle",
    category: "energy",
    damage: 40,
    range: 8,
    apCost: 3,
    accuracy: 0,
    armorPen: 5,
    knockback: 1,
  },
  {
    id: "ice_rifle",
    name: "Ice Rifle",
    category: "energy",
    damage: 25,
    range: 7,
    apCost: 2,
    accuracy: 0,
    armorPen: 0,
    knockback: 0,
  },
  {
    id: "emp_gun",
    name: "EMP Gun",
    category: "energy",
    damage: 20,
    range: 6,
    apCost: 3,
    accuracy: 0,
    armorPen: 0,
    knockback: 0,
  },
  {
    id: "fists",
    name: "Fists",
    category: "melee",
    damage: 10,
    range: 1,
    apCost: 1,
    accuracy: 0,
    armorPen: 0,
    knockback: 0,
  },
  {
    id: "sword",
    name: "Sword",
    category: "melee",
    damage: 25,
    range: 1,
    apCost: 2,
    accuracy: 1,
    armorPen: 2,
    knockback: 0,
  },
  {
    id: "super_punch",
    name: "Super Punch",
    category: "melee",
    damage: 40,
    range: 1,
    apCost: 3,
    accuracy: 0,
    armorPen: 3,
    knockback: 2,
  },
  {
    id: "rocket_launcher",
    name: "Rocket Launcher",
    category: "heavy",
    damage: 60,
    range: 10,
    apCost: 4,
    accuracy: -1,
    armorPen: 6,
    knockback: 3,
    ammo: 4,
    reload: 4,
  },
  {
    id: "minigun",
    name: "Minigun",
    category: "heavy",
    damage: 20,
    range: 6,
    apCost: 4,
    accuracy: -2,
    armorPen: 2,
    knockback: 1,
    ammo: 200,
    reload: 5,
  },
]

// Armor database
export const ARMORS: Armor[] = [
  {
    id: "none",
    name: "None",
    physicalDr: 0,
    energyDr: 0,
    movementPenalty: 0,
    stealthPenalty: 0,
    description: "Civilian clothes",
  },
  {
    id: "kevlar",
    name: "Kevlar",
    physicalDr: 6,
    energyDr: 3,
    movementPenalty: 0,
    stealthPenalty: 0,
    description: "Standard protection",
  },
  {
    id: "tactical",
    name: "Tactical Armor",
    physicalDr: 8,
    energyDr: 4,
    movementPenalty: 0,
    stealthPenalty: -1,
    description: "Military-grade ballistic vest with ceramic plate inserts",
  },
  {
    id: "combat",
    name: "Combat Armor",
    physicalDr: 12,
    energyDr: 6,
    movementPenalty: -1,
    stealthPenalty: -2,
    description: "Heavy armor",
  },
  {
    id: "power",
    name: "Power Armor",
    physicalDr: 18,
    energyDr: 12,
    movementPenalty: 0,
    stealthPenalty: -3,
    description: "Powered exosuit",
  },
  {
    id: "mystic_ward",
    name: "Mystic Ward",
    physicalDr: 5,
    energyDr: 15,
    movementPenalty: 0,
    stealthPenalty: 0,
    description: "Magic protection",
  },
  {
    id: "alien_hide",
    name: "Alien Hide",
    physicalDr: 14,
    energyDr: 14,
    movementPenalty: 0,
    stealthPenalty: -1,
    description: "Organic armor",
  },
]

// Powers database
export const POWERS: Power[] = [
  {
    id: "super_strength",
    name: "Super Strength",
    category: "physical",
    description: "+30 melee damage, throw objects, knockback +2",
    apCost: 0,
    passive: true,
  },
  {
    id: "super_speed",
    name: "Super Speed",
    category: "physical",
    description: "+3 movement, +2 initiative",
    apCost: 0,
    passive: true,
  },
  {
    id: "durability",
    name: "Durability",
    category: "physical",
    description: "+50 HP, +5 DR",
    apCost: 0,
    passive: true,
  },
  {
    id: "energy_bolt",
    name: "Energy Bolt",
    category: "energy",
    description: "Ranged attack, 35 damage, 8 range",
    apCost: 3,
  },
  {
    id: "fire_blast",
    name: "Fire Blast",
    category: "energy",
    description: "AoE fire damage, burning effect",
    apCost: 4,
  },
  { id: "ice_blast", name: "Ice Blast", category: "energy", description: "Slow enemies, freeze on crit", apCost: 3 },
  { id: "lightning", name: "Lightning", category: "energy", description: "Chain to 3 targets, stun chance", apCost: 4 },
  {
    id: "telepathy",
    name: "Telepathy",
    category: "mental",
    description: "Read minds, detect hidden enemies",
    apCost: 2,
  },
  { id: "telekinesis", name: "Telekinesis", category: "mental", description: "Move objects, throw enemies", apCost: 3 },
  {
    id: "psychic_blast",
    name: "Psychic Blast",
    category: "mental",
    description: "Mental damage ignores armor",
    apCost: 3,
  },
  {
    id: "force_field",
    name: "Force Field",
    category: "defensive",
    description: "Project 3x3 barrier, blocks 50 damage",
    apCost: 3,
    charges: 3,
  },
  {
    id: "regeneration",
    name: "Regeneration",
    category: "defensive",
    description: "Heal 10 HP per turn",
    apCost: 0,
    passive: true,
  },
  { id: "absorption", name: "Absorption", category: "defensive", description: "Convert damage to energy", apCost: 2 },
  {
    id: "flight",
    name: "Flight",
    category: "travel",
    description: "Ignore ground terrain, +2 vs ground melee",
    apCost: 1,
  },
  { id: "teleport", name: "Teleport", category: "travel", description: "Instant move up to 10 tiles", apCost: 3 },
  {
    id: "invisibility",
    name: "Invisibility",
    category: "alteration",
    description: "Cannot be targeted, +50% crit",
    apCost: 3,
  },
  {
    id: "shape_shift",
    name: "Shape-Shift",
    category: "alteration",
    description: "Copy appearance and abilities",
    apCost: 4,
  },
  { id: "phasing", name: "Phasing", category: "alteration", description: "Pass through walls and attacks", apCost: 2 },
]

// Gadgets database
export const GADGETS: Gadget[] = [
  { id: "frag_grenade", name: "Frag Grenade", slot: 1, description: "Explosive, AoE damage" },
  { id: "smoke_grenade", name: "Smoke Grenade", slot: 1, description: "Blocks line of sight" },
  { id: "emp_grenade", name: "EMP Grenade", slot: 1, description: "Disables tech and constructs" },
  { id: "flashbang", name: "Flashbang", slot: 1, description: "Stuns enemies in radius" },
  { id: "medkit", name: "Medkit", slot: 2, description: "Heal 30 HP" },
  { id: "stim_pack", name: "Stim Pack", slot: 2, description: "+2 AP this turn" },
  { id: "scanner", name: "Scanner", slot: 2, description: "Reveal hidden enemies" },
  { id: "grapple_hook", name: "Grapple Hook", slot: 3, description: "Reach elevated positions" },
  { id: "jet_pack", name: "Jet Pack", slot: 3, description: "Temporary flight" },
  { id: "cloaking_device", name: "Cloaking Device", slot: 3, description: "Temporary invisibility" },
]

// Calculate secondary stats from primary
export function calculateSecondaryStats(primary: PrimaryStat, origin: Origin): SecondaryStat {
  const originData = ORIGINS[origin] || ORIGINS.skilled_human
  return {
    hp: 50 + Math.floor(primary.end * 1.5) + originData.hpMod,
    maxAp: 4 + Math.floor(primary.agl / 20),
    movement: 4 + Math.floor(primary.agl / 20),
    initiative: Math.floor((primary.agl + primary.int) / 2),
    meleeDamageBonus: Math.floor(primary.str / 10),
    dodgeBonus: Math.floor(primary.agl / 20),
    mentalResistance: Math.floor(primary.psy / 20),
  }
}

// Calculate threat level
export function calculateThreatLevel(character: GameCharacter): {
  level: number
  score: number
  stars: number
  label: string
} {
  const avgStats = Object.values(character.primaryStats).reduce((a, b) => a + b, 0) / 6
  const secondary = calculateSecondaryStats(character.primaryStats, character.origin)
  const weapon = WEAPONS.find((w) => w.id === character.weapon)
  const armor = ARMORS.find((a) => a.id === character.armor)

  const originBonus: Record<Origin, number> = {
    skilled_human: 0,
    altered_human: 2,
    mutant: 3,
    tech_enhanced: 4,
    mystic: 4,
    alien: 5,
    construct: 6,
    divine: 6,
    cosmic: 8,
  }

  const score =
    Math.floor(avgStats / 10) +
    Math.floor(secondary.hp / 25) +
    Math.floor((weapon?.damage || 0) / 10) +
    Math.floor((armor?.physicalDr || 0) / 5) +
    character.powers.length * 5 +
    originBonus[character.origin]

  let level = 0,
    stars = 0,
    label = "Alpha"
  if (score <= 10) {
    level = 0
    stars = 0
    label = "Alpha - Civilian"
  } else if (score <= 20) {
    level = 1
    stars = 1
    label = "Level 1 - Street"
  } else if (score <= 35) {
    level = 2
    stars = 2
    label = "Level 2 - Professional"
  } else if (score <= 50) {
    level = 3
    stars = 3
    label = "Level 3 - Enhanced"
  } else if (score <= 70) {
    level = 4
    stars = 4
    label = "Level 4 - Super"
  } else {
    level = 5
    stars = 5
    label = "Level 5 - World-class"
  }

  return { level, score, stars, label }
}

// Default new character
export function createNewCharacter(): GameCharacter {
  return {
    id: `char-${Date.now()}`,
    name: "",
    codename: "",
    team: "heroes",
    origin: "skilled_human",
    personality: "tactical",
    secretIdentity: true,
    backstory: "",
    avatar: "/superhero-portrait.jpg",
    primaryStats: { str: 30, agl: 30, end: 30, rsn: 30, int: 30, psy: 30 },
    weapon: null,
    armor: null,
    gadgets: [],
    powers: [],
  }
}

// Validate character before saving
export function validateCharacter(character: GameCharacter): string[] {
  const errors: string[] = []
  if (!character.name.trim()) errors.push("Name is required")
  if (!character.codename.trim()) errors.push("Codename is required")

  const totalPoints = Object.values(character.primaryStats).reduce((a, b) => a + b, 0)
  const targetPoints = 200
  if (totalPoints !== targetPoints) {
    errors.push(`${targetPoints - totalPoints} stat points remaining`)
  }

  if (!character.weapon) errors.push("No weapon selected")

  // Check power limits based on origin
  const origin = ORIGINS[character.origin]
  if (character.origin === "skilled_human" && character.powers.length > 0) {
    errors.push("Skilled Humans cannot have powers")
  }

  return errors
}
