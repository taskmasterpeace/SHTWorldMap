"use client"

import { useState, useMemo, type JSX } from "react"
import {
  Phone,
  Mail,
  Users,
  MessageSquare,
  Settings,
  Map,
  Home,
  ChevronLeft,
  ChevronRight,
  PhoneCall,
  PhoneOff,
  Search,
  ZoomIn,
  ZoomOut,
  Navigation,
  MapPin,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Minus,
  Circle,
  Target,
  Dumbbell,
  Badge as Bandage,
  Moon,
  FlaskConical,
  Clock,
  HelpCircle,
  Skull,
  Ban,
  Trash2,
  Paperclip,
  Heart,
} from "lucide-react"
import { GRID_COLS, GRID_ROWS, MAP_GRID, type GridCell } from "@/lib/map-grid-data"
import { SAMPLE_EMAILS, SAMPLE_PERSONNEL, type Email } from "@/lib/laptop-data"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const GRID_CELL_SIZE = 40

interface MobilePhoneProps {
  isOpen: boolean
  onClose: () => void
  emails?: Email[]
  onEmailChoice?: (emailId: string, choiceId: string) => void
  gameTime: Date
  gameDay: number
  gameYear: number
  onNavigateToSector?: (cell: GridCell) => void
  onSelectSector?: (cell: GridCell) => void
  orientation: PhoneOrientation
}

type PhoneScreen = "home" | "phone" | "email" | "contacts" | "settings" | "map" | "messages"
type PhoneOrientation = "portrait" | "landscape"
type PhoneState = "dialpad" | "dialing" | "connected"

// Sample conversation data for phone calls
const PHONE_CONVERSATIONS: Record<
  string,
  {
    greeting: string
    messages: { speaker: "them" | "you"; text: string }[]
    choices?: { id: string; text: string; response: string }[]
  }
> = {
  Stampede: {
    greeting: "Hey boss, what's up?",
    messages: [
      {
        speaker: "them",
        text: "I'm at the training facility right now. Got some intel on that situation in sector G-12.",
      },
      { speaker: "them", text: "There's been some unusual activity. Want me to check it out?" },
    ],
    choices: [
      { id: "investigate", text: "Yes, investigate immediately", response: "On it! I'll report back in an hour." },
      {
        id: "wait",
        text: "No, wait for backup first",
        response: "Copy that. I'll standby until reinforcements arrive.",
      },
      { id: "return", text: "Return to base for briefing", response: "Understood. Heading back now." },
    ],
  },
  CrossFire: {
    greeting: "CrossFire here. What do you need?",
    messages: [
      { speaker: "them", text: "I've been monitoring the comms. Picked up some chatter about a potential threat." },
      { speaker: "them", text: "Sounds like they're planning something big. Should I dig deeper?" },
    ],
    choices: [
      { id: "dig", text: "Yes, gather more intel", response: "I'll tap into their frequencies. Give me 30 minutes." },
      {
        id: "alert",
        text: "Alert the rest of the team",
        response: "Broadcasting alert now. Everyone will be on high alert.",
      },
      { id: "ignore", text: "It's probably nothing", response: "If you say so... I'll keep an ear out anyway." },
    ],
  },
  Nightshade: {
    greeting: "...*static*... Nightshade reporting in.",
    messages: [
      { speaker: "them", text: "I'm deep undercover. Can't talk long." },
      { speaker: "them", text: "The target is moving. I need authorization to proceed." },
    ],
    choices: [
      { id: "proceed", text: "You're cleared to engage", response: "Acknowledged. Going dark. *click*" },
      { id: "abort", text: "Abort mission, too risky", response: "...Understood. Extracting now." },
      { id: "observe", text: "Continue surveillance only", response: "Copy. Eyes only. Nightshade out." },
    ],
  },
  Techna: {
    greeting: "Techna online! What can I do for you?",
    messages: [
      { speaker: "them", text: "I've been working on some new gadgets. Got a prototype ready for testing!" },
      { speaker: "them", text: "Also, the security systems need an upgrade. It's been on my list." },
    ],
    choices: [
      {
        id: "gadgets",
        text: "Tell me about the prototype",
        response: "It's a cloaking device! Still has some bugs, but promising!",
      },
      {
        id: "security",
        text: "Prioritize security upgrades",
        response: "On it! I'll have the systems fortified by tomorrow.",
      },
      { id: "both", text: "Work on both simultaneously", response: "I love a challenge! Consider it done!" },
    ],
  },
}

const PHONE_APPS = [
  { id: "phone", name: "Phone", icon: Phone, color: "bg-green-500" },
  { id: "email", name: "Email", icon: Mail, color: "bg-blue-500" },
  { id: "contacts", name: "Contacts", icon: Users, color: "bg-orange-500" },
  { id: "messages", name: "Messages", icon: MessageSquare, color: "bg-purple-500" },
  { id: "map", name: "Map", icon: Map, color: "bg-red-500" },
  { id: "settings", name: "Settings", icon: Settings, color: "bg-gray-500" },
]

// Mock CONTACTS data (replace with actual data if available)
const CONTACTS = [
  {
    id: "c1",
    name: "Agent Smith",
    phone: "555-1234",
    status: "available",
    avatar: "/agent-smith.png",
    greeting: "Smith here. What's the situation?",
    responses: ["All clear.", "Inbound.", "Need backup."],
  },
  {
    id: "c2",
    name: "Dr. Evelyn Reed",
    phone: "555-5678",
    status: "busy",
    avatar: "/dr-reed.png",
    greeting: "Dr. Reed speaking.",
    responses: ["Analysis complete.", "Anomaly detected.", "Working on it."],
  },
  {
    id: "c3",
    name: "Commander Thorne",
    phone: "555-9012",
    status: "offline",
    avatar: "/commander-thorne.png",
    greeting: "Thorne speaking.",
    responses: ["Report.", "Stand down.", "Proceed with caution."],
  },
  {
    id: "c4",
    name: "Tech Specialist Alex",
    phone: "555-3456",
    status: "available",
    avatar: "/alex.png",
    greeting: "Alex online. How can I help?",
    responses: ["Gadget deployed.", "System secured.", "Working on the fix."],
  },
]

// Mock EMAILS data (replace with actual data if available)
const EMAILS = [
  {
    id: "e1",
    from: "Intelligence",
    subject: "Urgent Update: Sector Delta",
    body: "Intel suggests increased activity in Sector Delta. Recommend immediate investigation.",
    time: "10:30 AM",
    priority: "high",
    choices: ["Investigate", "Send Recon Drone", "Monitor for now"],
  },
  {
    id: "e2",
    from: "Logistics",
    subject: "Supply Drop Confirmation",
    body: "Your supply drop request for Sector Gamma has been confirmed. ETA 2 hours.",
    time: "9:15 AM",
    priority: "medium",
    choices: ["Acknowledge", "Change Delivery Location", "Cancel"],
  },
  {
    id: "e3",
    from: "Communications",
    subject: "Network Maintenance",
    body: "Scheduled network maintenance will occur tonight from 02:00 to 04:00.",
    time: "Yesterday",
    priority: "low",
    choices: ["Noted", "Reschedule if possible"],
  },
  {
    id: "e4",
    from: "Internal Affairs",
    subject: "Security Protocol Review",
    body: "Please review the updated security protocols attached.",
    time: "Yesterday",
    priority: "medium",
  },
]

const STATUS_ICONS = {
  active: { icon: Circle, color: "text-green-400", bg: "bg-green-400", label: "Active" },
  mission: { icon: Target, color: "text-blue-400", bg: "bg-blue-400", label: "On Mission" },
  training: { icon: Dumbbell, color: "text-yellow-400", bg: "bg-yellow-400", label: "Training" },
  injured: { icon: Bandage, color: "text-red-400", bg: "bg-red-400", label: "Injured" },
  resting: { icon: Moon, color: "text-purple-400", bg: "bg-purple-400", label: "Resting" },
  research: { icon: FlaskConical, color: "text-cyan-400", bg: "bg-cyan-400", label: "Research" },
  standby: { icon: Clock, color: "text-orange-400", bg: "bg-orange-400", label: "Standby" },
  mia: { icon: HelpCircle, color: "text-gray-400", bg: "bg-gray-400", label: "MIA" },
  deceased: { icon: Skull, color: "text-gray-600", bg: "bg-gray-600", label: "Deceased" },
  suspended: { icon: Ban, color: "text-red-600", bg: "bg-red-600", label: "Suspended" },
}

export function MobilePhone({
  isOpen,
  onClose,
  emails = SAMPLE_EMAILS,
  onEmailChoice,
  gameTime = new Date(),
  gameDay = 1,
  gameYear = 1,
  onNavigateToSector,
  onSelectSector,
  orientation,
}: MobilePhoneProps) {
  const [activeScreen, setActiveScreen] = useState<PhoneScreen>("home")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [phoneState, setPhoneState] = useState<PhoneState>("dialpad")
  const [dialedNumber, setDialedNumber] = useState("")
  const [activeCall, setActiveCall] = useState<string | null>(null)
  const [conversationIndex, setConversationIndex] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null)
  const [managedEmails, setManagedEmails] = useState<Email[]>(emails)

  const teamContacts = SAMPLE_PERSONNEL.filter((p) => p.category === "team")
  const unreadCount = managedEmails.filter((e) => !e.read).length

  const [savedContacts, setSavedContacts] = useState<string[]>(
    teamContacts.map((_, i) => `555-${String(i + 1).padStart(4, "0")}`),
  )
  const [showSavePrompt, setShowSavePrompt] = useState(false)

  const [mapSearchQuery, setMapSearchQuery] = useState("")
  const [phoneMapZoom, setPhoneMapZoom] = useState(0.15)
  const [phoneMapPosition, setPhoneMapPosition] = useState({ x: 0, y: 0 })
  const [selectedMapCell, setSelectedMapCell] = useState<GridCell | null>(null)

  const getStatusColor = (status: string) => {
    if (status === "Active" || status === "active") return "bg-green-500"
    if (status === "On Mission" || status === "mission") return "bg-yellow-500"
    return "bg-gray-500"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      case "low":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleDeleteEmail = (emailId: string) => {
    setManagedEmails((prev) => prev.filter((e) => e.id !== emailId))
    setSelectedEmail(null)
  }

  const handleMarkAsRead = (emailId: string) => {
    setManagedEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, read: true } : e)))
  }

  const renderTextWithTooltips = (
    text: string,
    tooltips?: { word: string; definition: string }[],
  ): string | JSX.Element[] => {
    if (!tooltips || tooltips.length === 0) return text

    let result: (string | JSX.Element)[] = [text]

    tooltips.forEach((tooltip, index) => {
      result = result.flatMap((part) => {
        if (typeof part !== "string") return part
        const regex = new RegExp(`(${tooltip.word})`, "gi")
        const parts = part.split(regex)
        return parts.map((p, i) => {
          if (p.toLowerCase() === tooltip.word.toLowerCase()) {
            return (
              <TooltipProvider key={`${index}-${i}`}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="underline decoration-dotted decoration-cyan-400 cursor-help text-cyan-300">
                      {p}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1b3a4b] border-cyan-500/50 text-white max-w-[200px]">
                    <p className="text-xs">{tooltip.definition}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          }
          return p
        })
      })
    })

    return result
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return "bg-green-500"
    if (health >= 50) return "bg-yellow-500"
    if (health >= 25) return "bg-orange-500"
    return "bg-red-500"
  }

  const handleDialPress = (digit: string) => {
    if (dialedNumber.length < 12) {
      setDialedNumber((prev) => prev + digit)
    }
  }

  const handleCall = () => {
    if (dialedNumber.length > 0) {
      const contactIndex = teamContacts.findIndex((_, i) => `555-${String(i + 1).padStart(4, "0")}` === dialedNumber)
      if (contactIndex !== -1) {
        setActiveCall(teamContacts[contactIndex].name)
      } else {
        setActiveCall("Unknown")
      }
      setPhoneState("dialing")
      setTimeout(() => {
        setPhoneState("connected")
        setConversationIndex(0)
        setSelectedResponse(null)
      }, 2000)
    }
  }

  const handleEndCall = () => {
    if (activeCall && !savedContacts.includes(dialedNumber) && activeCall !== "Unknown") {
      setShowSavePrompt(true)
    } else {
      resetCallState()
    }
  }

  const resetCallState = () => {
    setPhoneState("dialpad")
    setActiveCall(null)
    setDialedNumber("")
    setConversationIndex(0)
    setSelectedResponse(null)
    setShowSavePrompt(false)
  }

  const handleSaveContact = () => {
    if (dialedNumber && !savedContacts.includes(dialedNumber)) {
      setSavedContacts((prev) => [...prev, dialedNumber])
    }
    setShowSavePrompt(false)
  }

  const handleCallFromContacts = (contactName: string, index: number) => {
    const phoneNumber = `555-${String(index + 1).padStart(4, "0")}`
    setDialedNumber(phoneNumber)
    setActiveCall(contactName)
    setActiveScreen("phone")
    setPhoneState("dialing")
    setTimeout(() => {
      setPhoneState("connected")
      setConversationIndex(0)
      setSelectedResponse(null)
    }, 2000)
  }

  const gridCells = useMemo(() => MAP_GRID, [])

  const searchResults = useMemo(() => {
    if (!mapSearchQuery.trim()) return []
    const query = mapSearchQuery.toLowerCase()
    const uniqueRegions = new Map<string, GridCell>()
    gridCells.forEach((cell) => {
      if (cell.region.toLowerCase().includes(query) || cell.countries?.some((c) => c.toLowerCase().includes(query))) {
        if (!uniqueRegions.has(cell.region)) {
          uniqueRegions.set(cell.region, cell)
        }
      }
    })
    return Array.from(uniqueRegions.values()).slice(0, 10)
  }, [mapSearchQuery, gridCells])

  const handleGoToSector = (cell: GridCell) => {
    setSelectedMapCell(cell)
    if (onNavigateToSector) {
      onNavigateToSector(cell)
    }
    if (onSelectSector) {
      onSelectSector(cell)
    }
  }

  const currentConversation = activeCall ? PHONE_CONVERSATIONS[activeCall] : null

  // Updated status bar to use game time directly
  const formatPhoneTime = () => {
    const hours = gameTime.getHours()
    const minutes = gameTime.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`
  }

  const getDayOfWeek = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[gameTime.getDay()]
  }

  // Update time and day formatting
  const timeString = gameTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })

  const dayOfWeek = gameTime.toLocaleDateString("en-US", { weekday: "short" })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Phone Frame */}
      <div
        className={`relative bg-[#1a1a2e] rounded-[2rem] shadow-2xl border-4 border-gray-800 flex flex-col transition-all duration-300 ${
          orientation === "portrait" ? "w-[320px] h-[640px]" : "w-[580px] h-[300px]"
        }`}
      >
        {/* Phone Status Bar */}
        <div className="bg-black/30 px-4 py-1 flex items-center justify-between text-[10px] text-white/70 rounded-t-[1.5rem]">
          <span>{gameTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <div className="flex items-center gap-2">
            <span>
              {gameTime.toLocaleDateString("en-US", { weekday: "short" })} Day {gameDay}, Year {gameYear}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-xl" />

        {/* Phone Content */}
        <div className="flex-1 overflow-hidden bg-gradient-to-b from-[#0d1a2d] to-[#1a2d40]">
          {/* Home Screen */}
          {activeScreen === "home" && (
            <div className={`h-full flex flex-col ${orientation === "portrait" ? "p-4 pt-8" : "p-3 pt-4"}`}>
              {/* Branding */}
              <div className="text-center mb-4">
                <h2
                  className={`text-cyan-400 font-bold tracking-wider ${orientation === "portrait" ? "text-lg" : "text-sm"}`}
                >
                  SENTINEL
                </h2>
                <p className={`text-cyan-600/50 ${orientation === "portrait" ? "text-[10px]" : "text-[8px]"}`}>
                  {" "}
                  MOBILE COMMAND
                </p>
              </div>

              {/* App Grid */}
              <div
                className={`grid ${orientation === "portrait" ? "grid-cols-3 gap-6" : "grid-cols-6 gap-3"} flex-1 content-start`}
              >
                {PHONE_APPS.map((app) => (
                  <button
                    key={app.id}
                    onClick={() => setActiveScreen(app.id as PhoneScreen)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={`${app.color} ${orientation === "portrait" ? "w-14 h-14" : "w-10 h-10"} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform relative`}
                    >
                      <app.icon className={`text-white ${orientation === "portrait" ? "w-7 h-7" : "w-5 h-5"}`} />
                      {/* Badge for email */}
                      {app.id === "email" && unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                          {unreadCount}
                        </div>
                      )}
                    </div>
                    <span className={`text-white/80 ${orientation === "portrait" ? "text-xs" : "text-[10px]"}`}>
                      {app.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phone App */}
          {activeScreen === "phone" && (
            <div className={`h-full flex flex-col ${orientation === "portrait" ? "p-4" : "p-2"}`}>
              {/* App Header */}
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setActiveScreen("home")} className="text-cyan-400 hover:text-cyan-300">
                  <Home className="w-5 h-5" />
                </button>
                <h3 className="text-white font-semibold">Phone</h3>
              </div>

              {phoneState === "dialpad" && (
                <>
                  {/* Number Display */}
                  <div className="bg-[#0a1420] rounded-lg p-3 mb-3 text-center">
                    <span className={`text-white font-mono ${orientation === "portrait" ? "text-2xl" : "text-xl"}`}>
                      {dialedNumber || "Enter Number"}
                    </span>
                  </div>

                  {/* Dialpad */}
                  <div className={`grid grid-cols-3 gap-2 ${orientation === "portrait" ? "mb-3" : "mb-2"}`}>
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                      <button
                        key={digit}
                        onClick={() => handleDialPress(digit)}
                        className={`bg-[#1a2d40] hover:bg-[#2a3d50] text-white rounded-full ${
                          orientation === "portrait" ? "w-16 h-16 text-2xl" : "w-12 h-12 text-xl"
                        } flex items-center justify-center mx-auto transition-colors`}
                      >
                        {digit}
                      </button>
                    ))}
                  </div>

                  {/* Call/Delete Buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setDialedNumber((prev) => prev.slice(0, -1))}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-full text-sm"
                    >
                      Delete
                    </button>
                    <button
                      onClick={handleCall}
                      disabled={dialedNumber.length === 0}
                      className="bg-green-500 hover:bg-green-400 text-white px-6 py-2 rounded-full flex items-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      <PhoneCall className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                </>
              )}

              {phoneState === "dialing" && activeCall && (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4 animate-pulse">
                    <Phone className="w-10 h-10 text-cyan-400" />
                  </div>
                  <p className="text-white text-lg font-semibold">{activeCall}</p>
                  <p className="text-gray-400 text-sm">Calling...</p>
                  <button
                    onClick={handleEndCall}
                    className="mt-6 bg-red-500 hover:bg-red-400 text-white p-4 rounded-full"
                  >
                    <PhoneOff className="w-6 h-6" />
                  </button>
                </div>
              )}

              {phoneState === "connected" && currentConversation && (
                <div className="flex-1 flex flex-col">
                  <div className="text-center mb-3">
                    <p className="text-white font-semibold">{activeCall}</p>
                    <p className="text-green-400 text-xs">Connected</p>
                  </div>
                  <div className="flex-1 bg-[#0a1420] rounded-lg p-2 overflow-y-auto mb-2">
                    <div className="bg-[#1b3a4b] rounded-lg p-3 mb-2">
                      <p className={`text-white ${orientation === "portrait" ? "text-sm" : "text-xs"}`}>
                        {currentConversation.greeting}
                      </p>
                    </div>

                    {currentConversation.messages.slice(0, conversationIndex + 1).map((msg, i) => (
                      <div
                        key={i}
                        className={`rounded-lg p-3 mb-2 ${msg.speaker === "them" ? "bg-[#1b3a4b]" : "bg-cyan-700 ml-8"}`}
                      >
                        <p className={`text-white ${orientation === "portrait" ? "text-sm" : "text-xs"}`}>{msg.text}</p>
                      </div>
                    ))}

                    {selectedResponse && (
                      <div className="bg-cyan-700 rounded-lg p-3 ml-8">
                        <p className={`text-white ${orientation === "portrait" ? "text-sm" : "text-xs"}`}>
                          {selectedResponse}
                        </p>
                      </div>
                    )}
                  </div>
                  {!selectedResponse && currentConversation.choices && (
                    <div className="space-y-1 mb-2">
                      <p className="text-cyan-400 text-xs uppercase">Choose response:</p>
                      {currentConversation.choices.map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => setSelectedResponse(choice.response)}
                          className={`w-full text-left ${orientation === "portrait" ? "p-3" : "p-2"} rounded-lg bg-[#1b3a4b] hover:bg-[#2a4a5b] text-white transition-colors`}
                        >
                          <span className={orientation === "portrait" ? "text-sm" : "text-xs"}>{choice.text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={handleEndCall}
                    className="bg-red-500 hover:bg-red-400 text-white p-3 rounded-full self-center"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              )}

              {showSavePrompt && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center p-4">
                  <div className="bg-[#1b3a4b] rounded-xl p-4 w-full max-w-[280px]">
                    <p className="text-white text-center mb-4">Save {dialedNumber} to contacts?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          handleSaveContact()
                          resetCallState()
                        }}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-bold"
                      >
                        Save
                      </button>
                      <button
                        onClick={resetCallState}
                        className="flex-1 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white font-bold"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Email App - UPDATED */}
          {activeScreen === "email" && (
            <div className={`h-full flex flex-col ${orientation === "portrait" ? "p-4" : "p-2"}`}>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => {
                    setActiveScreen("home")
                    setSelectedEmail(null)
                  }}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Home className="w-5 h-5" />
                </button>
                <span
                  className={`text-white font-bold uppercase tracking-wider ${orientation === "portrait" ? "text-sm" : "text-xs"}`}
                >
                  Email
                </span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
                )}
                {selectedEmail && (
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="text-cyan-400 hover:text-cyan-300 ml-auto text-xs"
                  >
                    Back to Inbox
                  </button>
                )}
              </div>

              {selectedEmail ? (
                <div className="flex-1 overflow-y-auto">
                  <div className="bg-[#1b3a4b] rounded-lg p-3">
                    {/* Email header with delete button */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedEmail.priority)}`} />
                        <span
                          className={`text-white font-bold ${orientation === "portrait" ? "text-base" : "text-sm"}`}
                        >
                          {selectedEmail.sender}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteEmail(selectedEmail.id)}
                        className="text-red-400 hover:text-red-300 p-1"
                        title="Delete email"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subject */}
                    <p
                      className={`text-cyan-300 font-semibold mb-1 ${orientation === "portrait" ? "text-sm" : "text-xs"}`}
                    >
                      {selectedEmail.subject}
                    </p>

                    <div className="flex items-center gap-2 text-gray-400 text-[10px] mb-3">
                      <span>
                        Day {selectedEmail.day}, Year {selectedEmail.year || 1}
                      </span>
                      <span>•</span>
                      <span>{selectedEmail.received}</span>
                      {selectedEmail.hasAttachment && (
                        <>
                          <span>•</span>
                          <Paperclip className="w-3 h-3" />
                        </>
                      )}
                    </div>

                    <div
                      className={`text-white/80 mb-4 whitespace-pre-line ${orientation === "portrait" ? "text-sm" : "text-xs"}`}
                    >
                      {renderTextWithTooltips(selectedEmail.body, selectedEmail.tooltips)}
                    </div>

                    {selectedEmail.choices && (
                      <div className="space-y-2 border-t border-cyan-600/30 pt-3">
                        <p className="text-cyan-400 text-xs uppercase">Actions:</p>
                        {selectedEmail.choices.map((choice) => (
                          <button
                            key={choice.id}
                            onClick={() => onEmailChoice?.(selectedEmail.id, choice.id)}
                            className={`w-full text-left ${orientation === "portrait" ? "p-3" : "p-2"} rounded bg-cyan-800/30 hover:bg-cyan-700/50 text-white transition-colors`}
                          >
                            <span className={orientation === "portrait" ? "text-sm" : "text-xs"}>{choice.text}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-2">
                  {managedEmails.map((email) => (
                    <button
                      key={email.id}
                      onClick={() => {
                        setSelectedEmail(email)
                        handleMarkAsRead(email.id)
                      }}
                      className={`w-full text-left rounded-lg p-3 transition-colors ${
                        email.read
                          ? "bg-[#1b3a4b]/50 hover:bg-[#2a4a5b]/50"
                          : "bg-[#1b3a4b] hover:bg-[#2a4a5b] border-l-2 border-cyan-400"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {!email.read && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(email.priority)}`} />
                          <span
                            className={`font-bold ${email.read ? "text-gray-400" : "text-white"} ${orientation === "portrait" ? "text-sm" : "text-xs"}`}
                          >
                            {email.sender}
                          </span>
                          {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-500" />}
                        </div>
                        <span className="text-gray-500 text-[10px]">
                          D{email.day} Y{email.year || 1}
                        </span>
                      </div>
                      <p
                        className={`truncate ${email.read ? "text-gray-500" : "text-cyan-300"} ${orientation === "portrait" ? "text-sm" : "text-xs"}`}
                      >
                        {email.subject}
                      </p>
                      <p className="text-gray-500 text-[10px] truncate mt-0.5">
                        {email.preview || email.body.substring(0, 50)}...
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Contacts App - UPDATED */}
          {activeScreen === "contacts" && (
            <div className={`h-full flex flex-col ${orientation === "portrait" ? "p-4" : "p-2"}`}>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setActiveScreen("home")} className="text-cyan-400 hover:text-cyan-300">
                  <Home className="w-5 h-5" />
                </button>
                <h3 className="text-white font-semibold">Personnel</h3>
              </div>

              {/* Quick Dial */}
              <div className="mb-4">
                <p className="text-cyan-400 text-xs uppercase mb-2">Quick Dial</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {teamContacts.slice(0, 4).map((contact, i) => {
                    const statusInfo =
                      STATUS_ICONS[contact.statusIcon as keyof typeof STATUS_ICONS] || STATUS_ICONS.active
                    return (
                      <button
                        key={contact.name}
                        onClick={() => handleCallFromContacts(contact.name, i)}
                        className="flex flex-col items-center gap-1 min-w-[60px] relative"
                      >
                        <div
                          className={`${orientation === "portrait" ? "w-12 h-12" : "w-10 h-10"} rounded-full overflow-hidden border-2 border-cyan-500/50 relative`}
                        >
                          <img
                            src={contact.avatar || "/placeholder.svg?height=48&width=48&query=hero avatar"}
                            alt={contact.name}
                            className="w-full h-full object-cover"
                          />
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusInfo.bg} border border-black`}
                          />
                        </div>
                        <span className="text-white text-[10px] truncate w-full text-center">
                          {contact.codename || contact.name}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                <p className="text-cyan-400 text-xs uppercase mb-2">All Personnel</p>
                <div className="space-y-2">
                  {SAMPLE_PERSONNEL.filter((p) => p.category === "team").map((person) => {
                    const statusInfo =
                      STATUS_ICONS[person.statusIcon as keyof typeof STATUS_ICONS] || STATUS_ICONS.active
                    const StatusIcon = statusInfo.icon
                    return (
                      <div
                        key={person.id}
                        className="w-full bg-[#1b3a4b] rounded-lg p-2 hover:bg-[#2a4a5b] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {/* Avatar with status indicator */}
                          <div
                            className={`${orientation === "portrait" ? "w-12 h-12" : "w-10 h-10"} rounded-full overflow-hidden flex-shrink-0 relative`}
                          >
                            <img
                              src={person.avatar || "/placeholder.svg?height=48&width=48&query=hero"}
                              alt={person.name}
                              className="w-full h-full object-cover"
                            />
                            <div
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${statusInfo.bg} border border-black`}
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-semibold text-sm truncate">
                                {person.codename || person.name}
                              </span>
                              {/* Status icon */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-[#1b3a4b] border-cyan-500/50">
                                    <p className="text-xs text-white">{statusInfo.label}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                              <MapPin className="w-3 h-3" />
                              <span>{person.location}</span>
                              {person.locationCode && <span className="text-cyan-400">({person.locationCode})</span>}
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getHealthColor(person.health || 100)} transition-all`}
                                  style={{ width: `${person.health || 100}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-gray-400">{person.health || 100}%</span>
                            </div>
                          </div>

                          {/* Call button */}
                          <button
                            onClick={() => handleCallFromContacts(person.name, Number.parseInt(person.id) - 1)}
                            className="p-2 bg-green-600 hover:bg-green-500 rounded-full"
                          >
                            <Phone className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {activeScreen === "map" && (
            <div className={`h-full flex flex-col ${orientation === "portrait" ? "" : ""}`}>
              {/* Map Header */}
              <div
                className={`flex items-center gap-2 ${orientation === "portrait" ? "p-3" : "p-2"} bg-[#0a1420] border-b border-cyan-900/50`}
              >
                <button onClick={() => setActiveScreen("home")} className="text-cyan-400 hover:text-cyan-300">
                  <Home className="w-5 h-5" />
                </button>
                <h3 className="text-white font-semibold text-sm">World Map</h3>

                {/* Search */}
                <div className="flex-1 ml-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                    <input
                      type="text"
                      value={mapSearchQuery}
                      onChange={(e) => setMapSearchQuery(e.target.value)}
                      placeholder="Search regions..."
                      className="w-full bg-[#1a2d40] text-white text-xs pl-7 pr-2 py-1 rounded border border-cyan-900/30 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-16 left-2 right-2 z-30 bg-[#0d1a2d] border border-cyan-500/30 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {searchResults.map((cell) => (
                    <button
                      key={cell.id}
                      onClick={() => {
                        handleGoToSector(cell)
                        setMapSearchQuery("")
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-cyan-500/20 text-left border-b border-cyan-900/20 last:border-0"
                    >
                      <MapPin className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                      <div>
                        <p className="text-white text-xs font-medium">{cell.region}</p>
                        <p className="text-gray-500 text-[10px]">Sector {cell.id}</p>
                      </div>
                      <Navigation className="w-3 h-3 text-cyan-400 ml-auto" />
                    </button>
                  ))}
                </div>
              )}

              {/* Mini Map View */}
              <div className="flex-1 relative overflow-hidden bg-[#0a1420]">
                {/* Map Container */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url('/world-map-image.svg')`,
                    backgroundSize: `${GRID_COLS * GRID_CELL_SIZE * phoneMapZoom}px ${GRID_ROWS * GRID_CELL_SIZE * phoneMapZoom}px`,
                    backgroundPosition: `${phoneMapPosition.x}px ${phoneMapPosition.y}px`,
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Grid Overlay */}
                  <div
                    className="absolute"
                    style={{
                      width: `${GRID_COLS * GRID_CELL_SIZE * phoneMapZoom}px`,
                      height: `${GRID_ROWS * GRID_CELL_SIZE * phoneMapZoom}px`,
                      transform: `translate(${phoneMapPosition.x}px, ${phoneMapPosition.y}px)`,
                    }}
                  >
                    {gridCells.map((cell) => (
                      <button
                        key={cell.id}
                        onClick={() => handleGoToSector(cell)}
                        className={`absolute border transition-colors ${
                          selectedMapCell?.id === cell.id
                            ? "border-yellow-400 bg-yellow-400/30"
                            : "border-cyan-500/20 hover:border-cyan-400 hover:bg-cyan-400/20"
                        }`}
                        style={{
                          left: `${(cell.col - 1) * GRID_CELL_SIZE * phoneMapZoom}px`,
                          top: `${(cell.row - 1) * GRID_CELL_SIZE * phoneMapZoom}px`,
                          width: `${GRID_CELL_SIZE * phoneMapZoom}px`,
                          height: `${GRID_CELL_SIZE * phoneMapZoom}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-2 right-2 flex flex-col gap-1 z-20">
                  <button
                    onClick={() => setPhoneMapZoom((z) => Math.min(z + 0.05, 0.3))}
                    className="bg-[#0d1a2d]/90 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 p-1.5 rounded"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPhoneMapZoom((z) => Math.max(z - 0.05, 0.08))}
                    className="bg-[#0d1a2d]/90 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 p-1.5 rounded"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                </div>

                {/* Pan Controls */}
                <div className="absolute bottom-2 left-2 z-20">
                  <div className="grid grid-cols-3 gap-0.5">
                    <div />
                    <button
                      onClick={() => setPhoneMapPosition((p) => ({ ...p, y: p.y + 30 }))}
                      className="bg-[#0d1a2d]/90 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 p-1 rounded"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <div />
                    <button
                      onClick={() => setPhoneMapPosition((p) => ({ ...p, x: p.x + 30 }))}
                      className="bg-[#0d1a2d]/90 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 p-1 rounded"
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                    <div className="bg-[#0d1a2d]/90 border border-cyan-500/30 p-1 rounded flex items-center justify-center">
                      <Navigation className="w-3 h-3 text-cyan-400" />
                    </div>
                    <button
                      onClick={() => setPhoneMapPosition((p) => ({ ...p, x: p.x - 30 }))}
                      className="bg-[#0d1a2d]/90 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 p-1 rounded"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <div />
                    <button
                      onClick={() => setPhoneMapPosition((p) => ({ ...p, y: p.y - 30 }))}
                      className="bg-[#0d1a2d]/90 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-400 p-1 rounded"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    <div />
                  </div>
                </div>

                {/* Selected Sector Info */}
                {selectedMapCell && (
                  <div className="absolute top-2 left-2 right-2 z-20 bg-[#0d1a2d]/95 border border-yellow-500/50 rounded-lg p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-300 text-xs font-bold">{selectedMapCell.region}</p>
                        <p className="text-gray-400 text-[10px]">Sector {selectedMapCell.id}</p>
                      </div>
                      <button
                        onClick={() => handleGoToSector(selectedMapCell)}
                        className="bg-cyan-500 hover:bg-cyan-400 text-white text-[10px] px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Navigation className="w-3 h-3" />
                        Go To
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Screen */}
          {activeScreen === "messages" && (
            <div
              className={`${orientation === "portrait" ? "p-4" : "p-3"} flex flex-col items-center justify-center h-full`}
            >
              <MessageSquare
                className={`${orientation === "portrait" ? "w-16 h-16" : "w-12 h-12"} text-cyan-400/50 mb-4`}
              />
              <p className="text-white text-center">Messages</p>
              <p className="text-cyan-400/70 text-xs text-center mt-2">No new messages</p>
            </div>
          )}

          {/* Settings Screen */}
          {activeScreen === "settings" && (
            <div className={`h-full flex flex-col ${orientation === "portrait" ? "p-4" : "p-2"}`}>
              <div className="flex items-center gap-2 mb-3">
                <button onClick={() => setActiveScreen("home")} className="text-cyan-400 hover:text-cyan-300">
                  <Home className="w-5 h-5" />
                </button>
                <h3 className="text-white font-semibold">Settings</h3>
              </div>
              <div className="space-y-2">
                {["Display", "Sound", "Notifications", "Privacy", "About"].map((setting) => (
                  <button
                    key={setting}
                    className="w-full flex items-center justify-between bg-[#1a2d40] hover:bg-[#2a3d50] rounded-lg p-3"
                  >
                    <span className="text-white text-sm">{setting}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-2 right-2 flex gap-1 z-10">
          <button
            onClick={() => {
              /* toggle orientation would be handled by parent */
            }}
            className="p-1.5 bg-gray-800/80 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Rotate"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-800/80 hover:bg-red-600 rounded-lg text-gray-400 hover:text-white transition-colors"
            title="Close"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Home indicator bar */}
        <div className="h-8 flex items-center justify-center bg-black/20 rounded-b-[1.5rem]">
          <div className="w-32 h-1 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  )
}
