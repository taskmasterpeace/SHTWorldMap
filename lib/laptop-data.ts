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
export const SAMPLE_EMAILS: Email[] = []

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

export const SAMPLE_PERSONNEL: Personnel[] = []

// Sample Finance Data
export const SAMPLE_FINANCES: FinanceEntry[] = []
