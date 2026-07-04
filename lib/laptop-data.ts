// Laptop data types and sample data

export interface Email {
  id: string
  read: boolean
  priority: "HIGH" | "MEDIUM" | "LOW"
  sender: string
  subject: string
  preview?: string // added preview field
  time?: string // added time field for backwards compatibility
  received: string
  day: number
  year?: number // added year field
  body: string
  hasAttachment?: boolean
  tooltips?: { word: string; definition: string }[] // added tooltips for words
  choices?: { id: string; text: string; consequence?: string }[]
}

export interface WebBookmark {
  id: string
  name: string
  url: string
  icon: string
  category: "news" | "agency" | "poi" | "intel"
}

export interface WebArticle {
  id: string
  siteId: string
  title: string
  date: string
  content: string
  image?: string
}

export interface PersonnelMember {
  id: string
  name: string
  codename?: string
  avatar: string
  category: "team" | "vigilante" | "criminal" | "prisoner"
  status: string
  statusIcon?:
    | "active"
    | "mission"
    | "training"
    | "injured"
    | "resting"
    | "research"
    | "standby"
    | "mia"
    | "deceased"
    | "suspended" // added 10 status icons
  location?: string
  locationCode?: string // added sector code
  health?: number // added health 0-100
  age?: number
  stats: {
    strength: number
    agility: number
    intellect: number
    endurance?: number
    instinct?: number
    psyche?: number
  }
  powers: string[]
  popularity: number
  salary?: number
  feelings?: { targetId: string; emoji: string; level: number }[]
  relationships?: { targetId: string; type: "ally" | "rival" | "neutral" | "enemy" | "friend" | "romantic" }[]
}

export interface FinanceEntry {
  id: string
  category: "income" | "salaries" | "lawsuits" | "health" | "pensions" | "insurance"
  description: string
  amount: number
  recurring?: "weekly" | "monthly" | "yearly" | "one-time"
}

// Sample Emails - more detailed with choices
export const SAMPLE_EMAILS: Email[] = [
  {
    id: "1",
    read: false,
    priority: "HIGH",
    sender: "Director Morrison",
    subject: "URGENT: Senator Kidnapping Update",
    preview: "We've received new intel on the Senator kidnapping case...",
    received: "10:45 AM",
    time: "10:45 AM",
    day: 28,
    year: 1, // added year
    hasAttachment: true,
    body: "Agent,\n\nWe've received new intel on the Senator kidnapping case. Our sources indicate the Syndicate is behind this. We need you to decide how to proceed.\n\nThe Senator's family is willing to pay the ransom, but this could fund further criminal activities. Alternatively, we can attempt a rescue operation, but it's high risk.\n\nWhat are your orders?",
    tooltips: [
      // added tooltips
      { word: "Syndicate", definition: "A powerful criminal organization operating across multiple countries" },
      { word: "ransom", definition: "A sum of money demanded for the release of a captive" },
    ],
    choices: [
      { id: "pay", text: "Pay the ransom - prioritize the Senator's safety", consequence: "ransom_paid" },
      { id: "rescue", text: "Launch rescue operation - we don't negotiate", consequence: "rescue_op" },
      { id: "stall", text: "Stall for time - gather more intelligence", consequence: "stall" },
    ],
  },
  {
    id: "2",
    read: false,
    priority: "HIGH",
    sender: "Agent Blackwood",
    subject: "Cover Blown - Need Extraction",
    preview: "My cover has been compromised. The Syndicate knows who I am...",
    received: "09:22 AM",
    time: "09:22 AM",
    day: 28,
    year: 1,
    body: "My cover has been compromised. The Syndicate knows who I am. I'm currently in a safe house in Moscow but I need extraction within 24 hours.\n\nPlease send a team immediately.",
    tooltips: [
      { word: "extraction", definition: "Emergency removal of an agent from hostile territory" },
      { word: "safe house", definition: "A secret location used to hide or shelter agents" },
    ],
    choices: [
      { id: "stampede", text: "Send Stampede's team for extraction", consequence: "send_team" },
      { id: "local", text: "Coordinate with local assets", consequence: "local_assets" },
      { id: "abort", text: "Mission aborted - return on your own", consequence: "abort" },
    ],
  },
  {
    id: "3",
    read: false,
    priority: "MEDIUM",
    sender: "Recruitment Division",
    subject: "New Vigilante Application - Shadow",
    preview: "A vigilante known as 'Shadow' has expressed interest...",
    received: "08:15 AM",
    time: "08:15 AM",
    day: 28,
    year: 1,
    hasAttachment: true,
    body: "A vigilante known as 'Shadow' has expressed interest in joining the team. He has been operating independently in the city for 2 years with a 78% success rate.\n\nHowever, there are concerns about his methods - he has been known to use excessive force.\n\nShould we proceed with recruitment?",
    tooltips: [{ word: "vigilante", definition: "A person who takes law enforcement into their own hands" }],
    choices: [
      { id: "recruit", text: "Approve recruitment - we need his skills", consequence: "recruit_shadow" },
      { id: "interview", text: "Schedule an interview first", consequence: "interview" },
      { id: "reject", text: "Reject application - too risky", consequence: "reject" },
    ],
  },
  {
    id: "4",
    read: true,
    priority: "MEDIUM",
    sender: "HR Department",
    subject: "Personnel Review - Quarterly Report",
    preview: "The quarterly personnel review is complete...",
    received: "Yesterday",
    time: "Yesterday",
    day: 27,
    year: 1,
    body: "The quarterly personnel review is complete. Overall team morale is at 72%. There are some interpersonal conflicts between Stampede and CrossFire that need addressing.\n\nRecommendation: Schedule team building exercises.",
  },
  {
    id: "5",
    read: true,
    priority: "LOW",
    sender: "Finance Department",
    subject: "Monthly Budget Report",
    preview: "Attached is the monthly budget report...",
    received: "2 days ago",
    time: "2 days ago",
    day: 26,
    year: 1,
    hasAttachment: true,
    body: "Attached is the monthly budget report. Overall spending is within limits, but the Medical department has exceeded their allocation by 15% due to recent mission casualties.\n\nPlease review and approve additional funding if necessary.",
  },
  {
    id: "6",
    read: true,
    priority: "LOW",
    sender: "BNN News Alert",
    subject: "Breaking: Supervillain Sighting in Tokyo",
    preview: "The notorious supervillain known as 'Phantom' has been spotted...",
    received: "3 days ago",
    time: "3 days ago",
    day: 25,
    year: 1,
    body: "BREAKING NEWS: The notorious supervillain known as 'Phantom' has been spotted in Tokyo's Shibuya district. Local authorities are on high alert.\n\nThis is an automated news alert from your BNN subscription.",
    tooltips: [
      { word: "Phantom", definition: "A dangerous supervillain with intangibility and fear projection powers" },
    ],
  },
]

// Sample Web Bookmarks
export const WEB_BOOKMARKS: WebBookmark[] = [
  { id: "bnn", name: "BNN News", url: "bnn.news", icon: "📺", category: "news" },
  { id: "agency", name: "Agency Portal", url: "agency.internal", icon: "🏛️", category: "agency" },
  { id: "intel", name: "Intel Database", url: "intel.secure", icon: "🔒", category: "intel" },
  { id: "poi", name: "Points of Interest", url: "poi.map", icon: "📍", category: "poi" },
]

// Sample Web Articles
export const WEB_ARTICLES: WebArticle[] = [
  {
    id: "1",
    siteId: "bnn",
    title: "Superhero Team Saves Downtown from Meteor Strike",
    date: "Day 28",
    content:
      "In a dramatic turn of events, the elite superhero team known as 'The Guardians' successfully intercepted a meteor headed for downtown metropolis. Witnesses describe seeing streaks of light as the heroes worked together to pulverize the space rock before it could cause catastrophic damage.\n\nProperty damage was minimal, with only a few windows shattered from the sonic boom. Mayor Johnson praised the heroes at a press conference this morning.",
  },
  {
    id: "2",
    siteId: "bnn",
    title: "Crime Rates Drop 40% in Protected Districts",
    date: "Day 27",
    content:
      "A new report shows that districts with active superhero patrols have seen a significant drop in crime rates. The study, conducted over six months, shows that visible hero presence acts as a strong deterrent.\n\nCritics argue this creates inequality between protected and unprotected areas.",
  },
  {
    id: "3",
    siteId: "agency",
    title: "Mission Briefing: Operation Shadow Strike",
    date: "Day 28",
    content:
      "CLASSIFIED\n\nObjective: Infiltrate Syndicate base in Eastern Europe\nTeam: Alpha Squad\nStatus: Pending Approval\n\nIntel suggests the Syndicate is developing a new superweapon. We need boots on the ground to confirm and neutralize if necessary.",
  },
]

export const SAMPLE_PERSONNEL: PersonnelMember[] = [
  {
    id: "1",
    name: "Randall Jenkins",
    codename: "Stampede",
    avatar: "/superhero-man-with-beard.jpg",
    category: "team",
    status: "Active",
    statusIcon: "active", // added status icon
    location: "HQ",
    locationCode: "A5", // added location code
    health: 85, // added health
    age: 34,
    salary: 85000,
    stats: { strength: 85, agility: 72, intellect: 45, endurance: 80, instinct: 65, psyche: 50 },
    powers: ["Super Strength", "Enhanced Durability"],
    popularity: 78,
    feelings: [
      { targetId: "2", emoji: "😊", level: 75 },
      { targetId: "3", emoji: "😠", level: 25 },
      { targetId: "4", emoji: "😐", level: 50 },
    ],
    relationships: [
      { targetId: "2", type: "friend" },
      { targetId: "3", type: "rival" },
    ],
  },
  {
    id: "2",
    name: "Jake Gallagar",
    codename: "CrossFire",
    avatar: "/superhero-man-tactical.jpg",
    category: "team",
    status: "On Mission",
    statusIcon: "mission", // added status icon
    location: "Miami",
    locationCode: "F12", // added location code
    health: 72, // added health
    age: 29,
    salary: 72000,
    stats: { strength: 55, agility: 88, intellect: 62, endurance: 60, instinct: 85, psyche: 55 },
    powers: ["Enhanced Accuracy", "Eagle Vision"],
    popularity: 65,
    feelings: [
      { targetId: "1", emoji: "😊", level: 80 },
      { targetId: "4", emoji: "😍", level: 70 },
    ],
    relationships: [
      { targetId: "1", type: "friend" },
      { targetId: "4", type: "romantic" },
    ],
  },
  {
    id: "3",
    name: "Cissy Oliva",
    codename: "Nightshade",
    avatar: "/superhero-woman.png",
    category: "team",
    status: "Training",
    statusIcon: "training", // added status icon
    location: "HQ",
    locationCode: "A5", // added location code
    health: 100, // added health
    age: 26,
    salary: 65000,
    stats: { strength: 45, agility: 90, intellect: 75, endurance: 55, instinct: 88, psyche: 70 },
    powers: ["Shadow Step", "Poison Touch"],
    popularity: 58,
    feelings: [
      { targetId: "1", emoji: "😤", level: 35 },
      { targetId: "2", emoji: "😐", level: 50 },
    ],
    relationships: [{ targetId: "1", type: "rival" }],
  },
  {
    id: "4",
    name: "Sarah Chen",
    codename: "Techna",
    avatar: "/asian-woman-scientist-superhero.jpg",
    category: "team",
    status: "Research",
    statusIcon: "research", // added status icon
    location: "Lab",
    locationCode: "A5", // added location code
    health: 95, // added health
    age: 31,
    salary: 78000,
    stats: { strength: 30, agility: 50, intellect: 95, endurance: 40, instinct: 60, psyche: 80 },
    powers: ["Technopathy", "Hacking"],
    popularity: 62,
    feelings: [
      { targetId: "2", emoji: "😊", level: 75 },
      { targetId: "1", emoji: "😐", level: 50 },
    ],
    relationships: [{ targetId: "2", type: "romantic" }],
  },
  {
    id: "5",
    name: "Viktor Volkov",
    codename: "Shadow",
    avatar: "/silhouette-mysterious-person-shadow.jpg",
    category: "vigilante",
    status: "Independent",
    statusIcon: "standby", // added status icon
    location: "Unknown",
    health: 90, // added health
    age: 38,
    stats: { strength: 60, agility: 95, intellect: 70, endurance: 65, instinct: 92, psyche: 45 },
    powers: ["Shadow Manipulation", "Invisibility"],
    popularity: 45,
    feelings: [],
    relationships: [],
  },
  {
    id: "6",
    name: "Maria Santos",
    codename: "Blaze",
    avatar: "/latina-woman-fire-powers-superhero.jpg",
    category: "vigilante",
    status: "Active - Unaffiliated",
    statusIcon: "active", // added status icon
    location: "Los Angeles",
    locationCode: "D8", // added location code
    health: 88, // added health
    age: 24,
    stats: { strength: 50, agility: 75, intellect: 55, endurance: 70, instinct: 65, psyche: 60 },
    powers: ["Pyrokinesis", "Heat Immunity"],
    popularity: 72,
    feelings: [],
    relationships: [],
  },
  {
    id: "7",
    name: "Marcus Kane",
    codename: "Rampage",
    avatar: "/villain-muscular-man.jpg",
    category: "criminal",
    status: "At Large",
    statusIcon: "mia", // added status icon
    location: "Unknown",
    health: 100, // added health
    age: 42,
    stats: { strength: 95, agility: 40, intellect: 30, endurance: 90, instinct: 55, psyche: 20 },
    powers: ["Berserker Rage", "Regeneration"],
    popularity: 12,
    feelings: [],
    relationships: [],
  },
  {
    id: "8",
    name: "The Phantom",
    codename: "Phantom",
    avatar: "/ghostly-villain-mask-dark-cape.jpg",
    category: "criminal",
    status: "At Large",
    statusIcon: "mia", // added status icon
    location: "Tokyo",
    locationCode: "R35", // added location code
    health: 100, // added health
    age: 0,
    stats: { strength: 40, agility: 85, intellect: 88, endurance: 50, instinct: 90, psyche: 95 },
    powers: ["Intangibility", "Fear Projection"],
    popularity: 5,
    feelings: [],
    relationships: [],
  },
  {
    id: "9",
    name: "Dr. Elena Frost",
    codename: "Ice Queen",
    avatar: "/villain-woman-ice-powers.jpg",
    category: "prisoner",
    status: "Max Security",
    statusIcon: "suspended", // added status icon
    location: "The Vault",
    health: 65, // added health
    age: 36,
    stats: { strength: 35, agility: 60, intellect: 92, endurance: 45, instinct: 70, psyche: 75 },
    powers: ["Cryokinesis", "Ice Armor"],
    popularity: 8,
    feelings: [],
    relationships: [],
  },
  {
    id: "10",
    name: 'Robert "Bobby" Briggs',
    codename: "Bulldozer",
    avatar: "/large-muscular-man-prison-jumpsuit-bald.jpg",
    category: "prisoner",
    status: "Medium Security",
    statusIcon: "suspended", // added status icon
    location: "Blackgate",
    health: 78, // added health
    age: 45,
    stats: { strength: 88, agility: 25, intellect: 35, endurance: 85, instinct: 40, psyche: 30 },
    powers: ["Enhanced Strength", "Thick Skin"],
    popularity: 15,
    feelings: [],
    relationships: [],
  },
]

// Sample Finance Data
export const SAMPLE_FINANCES: FinanceEntry[] = [
  { id: "1", category: "income", description: "Government Contract", amount: 500000, recurring: "monthly" },
  { id: "2", category: "income", description: "Private Donations", amount: 125000, recurring: "monthly" },
  { id: "3", category: "income", description: "Merchandise Licensing", amount: 45000, recurring: "monthly" },
  { id: "4", category: "income", description: "Mission Bonuses", amount: 80000, recurring: "monthly" },
  { id: "5", category: "salaries", description: "Stampede", amount: -85000, recurring: "yearly" },
  { id: "6", category: "salaries", description: "CrossFire", amount: -72000, recurring: "yearly" },
  { id: "7", category: "salaries", description: "Nightshade", amount: -65000, recurring: "yearly" },
  { id: "8", category: "salaries", description: "Techna", amount: -78000, recurring: "yearly" },
  { id: "9", category: "salaries", description: "Support Staff (12)", amount: -72000, recurring: "monthly" },
  { id: "10", category: "lawsuits", description: "Downtown Property Damage", amount: -250000, recurring: "one-time" },
  { id: "11", category: "lawsuits", description: "Civilian Injury Settlement", amount: -75000, recurring: "one-time" },
  { id: "12", category: "lawsuits", description: "Pending: Bridge Collapse", amount: -500000, recurring: "one-time" },
  { id: "13", category: "health", description: "Medical Bay Operations", amount: -35000, recurring: "monthly" },
  { id: "14", category: "health", description: "Hero Recovery - Stampede", amount: -12000, recurring: "one-time" },
  { id: "15", category: "health", description: "Funeral - Agent Williams", amount: -25000, recurring: "one-time" },
  { id: "16", category: "pensions", description: "Retired Heroes Fund", amount: -25000, recurring: "monthly" },
  { id: "17", category: "pensions", description: "Survivor Benefits", amount: -15000, recurring: "monthly" },
  { id: "18", category: "insurance", description: "Liability Insurance", amount: -80000, recurring: "monthly" },
  { id: "19", category: "insurance", description: "Equipment Insurance", amount: -15000, recurring: "monthly" },
  { id: "20", category: "insurance", description: "Life Insurance (Heroes)", amount: -45000, recurring: "monthly" },
]
