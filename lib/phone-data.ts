// Phone contacts and conversation data

export interface Contact {
  id: string
  name: string
  codename?: string
  phoneNumber: string
  avatar: string
  role: string
  organization?: string
  available: boolean
}

export interface DialogueChoice {
  id: string
  text: string
  nextNodeId: string | null // null means end conversation
}

export interface DialogueNode {
  id: string
  speaker: "caller" | "player"
  text: string
  choices?: DialogueChoice[]
  nextNodeId?: string // For auto-advance (no choices)
  emotion?: "neutral" | "happy" | "angry" | "worried" | "excited"
}

export interface Conversation {
  id: string
  contactId: string
  title: string
  startNodeId: string
  nodes: Record<string, DialogueNode>
  completed: boolean
}

// Contacts database
export const CONTACTS: Contact[] = [
  {
    id: "contact-1",
    name: "Marcus Webb",
    codename: "Oversight",
    phoneNumber: "555-0101",
    avatar: "/older-man-with-grey-beard-superhero.jpg",
    role: "Handler",
    organization: "Agency",
    available: true,
  },
  {
    id: "contact-2",
    name: "Dr. Sarah Chen",
    codename: "Catalyst",
    phoneNumber: "555-0102",
    avatar: "/asian-woman-scientist-superhero.jpg",
    role: "Tech Support",
    organization: "Research Division",
    available: true,
  },
  {
    id: "contact-3",
    name: "Jake Gallagar",
    codename: "CrossFire",
    phoneNumber: "555-0103",
    avatar: "/muscular-man-tactical-gear.jpg",
    role: "Field Agent",
    organization: "Strike Team Alpha",
    available: false,
  },
  {
    id: "contact-4",
    name: "Natasha Volkov",
    codename: "Widow",
    phoneNumber: "555-0104",
    avatar: "/russian-woman-spy-black-hair.jpg",
    role: "Intelligence",
    organization: "Eastern Bureau",
    available: true,
  },
  {
    id: "contact-5",
    name: "Commissioner Hayes",
    phoneNumber: "555-0199",
    avatar: "/police-commissioner-older-man-badge.jpg",
    role: "Law Enforcement",
    organization: "Metro PD",
    available: true,
  },
  {
    id: "contact-6",
    name: "Unknown Informant",
    codename: "Deep Throat",
    phoneNumber: "555-0000",
    avatar: "/silhouette-mysterious-person-shadow.jpg",
    role: "Informant",
    available: true,
  },
]

// Sample conversation with Marcus Webb
export const CONVERSATIONS: Record<string, Conversation> = {
  "conv-marcus-1": {
    id: "conv-marcus-1",
    contactId: "contact-1",
    title: "Mission Briefing",
    startNodeId: "node-1",
    completed: false,
    nodes: {
      "node-1": {
        id: "node-1",
        speaker: "caller",
        text: "Hey, glad you picked up. We've got a situation in Mumbai. Senator kidnapping case just escalated.",
        emotion: "worried",
        nextNodeId: "node-2",
      },
      "node-2": {
        id: "node-2",
        speaker: "caller",
        text: "Intel suggests the Crimson Hand is behind it. They're demanding $50 million and the release of their leader.",
        emotion: "neutral",
        choices: [
          { id: "choice-1", text: "What's our timeline?", nextNodeId: "node-3a" },
          { id: "choice-2", text: "Do we have eyes on the target?", nextNodeId: "node-3b" },
          { id: "choice-3", text: "I'll handle it. Send the coordinates.", nextNodeId: "node-4" },
        ],
      },
      "node-3a": {
        id: "node-3a",
        speaker: "caller",
        text: "48 hours. After that, they've threatened to go public with some... sensitive information about the Senator's dealings.",
        emotion: "worried",
        nextNodeId: "node-4",
      },
      "node-3b": {
        id: "node-3b",
        speaker: "caller",
        text: "Satellite tracked them to an abandoned factory in the industrial district. I'm sending the thermal imaging now.",
        emotion: "neutral",
        nextNodeId: "node-4",
      },
      "node-4": {
        id: "node-4",
        speaker: "caller",
        text: "Good. One more thing - CrossFire is already in the area but he's gone dark. Find him if you can.",
        emotion: "worried",
        choices: [
          { id: "choice-4", text: "Understood. I'm on my way.", nextNodeId: "node-5" },
          { id: "choice-5", text: "Why did CrossFire go dark?", nextNodeId: "node-5b" },
        ],
      },
      "node-5": {
        id: "node-5",
        speaker: "caller",
        text: "Good luck out there. Stay safe.",
        emotion: "neutral",
        nextNodeId: null,
      },
      "node-5b": {
        id: "node-5b",
        speaker: "caller",
        text: "Unknown. Could be compromised comms, could be... worse. Just find him.",
        emotion: "angry",
        nextNodeId: "node-5",
      },
    },
  },
  "conv-sarah-1": {
    id: "conv-sarah-1",
    contactId: "contact-2",
    title: "Tech Update",
    startNodeId: "node-1",
    completed: false,
    nodes: {
      "node-1": {
        id: "node-1",
        speaker: "caller",
        text: "Perfect timing! I just finished analyzing that sample you sent. You're not going to believe this.",
        emotion: "excited",
        choices: [
          { id: "choice-1", text: "Good news or bad news?", nextNodeId: "node-2a" },
          { id: "choice-2", text: "Tell me everything.", nextNodeId: "node-2b" },
        ],
      },
      "node-2a": {
        id: "node-2a",
        speaker: "caller",
        text: "Both, actually. The compound is synthetic - someone manufactured this. That's the bad news.",
        emotion: "worried",
        nextNodeId: "node-3",
      },
      "node-2b": {
        id: "node-2b",
        speaker: "caller",
        text: "The compound is definitely synthetic. Military-grade. Someone with serious resources made this.",
        emotion: "neutral",
        nextNodeId: "node-3",
      },
      "node-3": {
        id: "node-3",
        speaker: "caller",
        text: "The good news? I can trace the chemical signature. Only three labs in the world can produce this. I'll send you the list.",
        emotion: "happy",
        choices: [
          { id: "choice-3", text: "Great work, Doc.", nextNodeId: "node-4" },
          { id: "choice-4", text: "Can you narrow it down further?", nextNodeId: "node-4b" },
        ],
      },
      "node-4": {
        id: "node-4",
        speaker: "caller",
        text: "Just doing my job. Be careful out there - whoever made this isn't playing games.",
        emotion: "worried",
        nextNodeId: null,
      },
      "node-4b": {
        id: "node-4b",
        speaker: "caller",
        text: "Give me a few more hours. I might be able to match the exact batch number.",
        emotion: "neutral",
        nextNodeId: "node-4",
      },
    },
  },
}

// Helper to find contact by phone number
export function findContactByNumber(phoneNumber: string): Contact | undefined {
  return CONTACTS.find(
    (c) =>
      c.phoneNumber ===
      phoneNumber
        .replace(/-/g, "")
        .slice(-7)
        .replace(/(\d{3})(\d{4})/, "$1-$2"),
  )
}

// Helper to get conversation for a contact
export function getConversationForContact(contactId: string): Conversation | undefined {
  return Object.values(CONVERSATIONS).find((c) => c.contactId === contactId && !c.completed)
}
