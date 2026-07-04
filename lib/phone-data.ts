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
export const CONTACTS: Contact[] = []

// Sample conversation with Marcus Webb
export const CONVERSATIONS: Record<string, Conversation> = {}

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
