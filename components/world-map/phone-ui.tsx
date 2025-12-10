"use client"

import { useState, useEffect } from "react"
import { CONTACTS, CONVERSATIONS, type Contact, type DialogueNode } from "@/lib/phone-data"

interface PhoneUIProps {
  isOpen: boolean
  onClose: () => void
}

type PhoneState = "idle" | "contacts" | "dialing" | "ringing" | "incoming" | "connected"

export function PhoneUI({ isOpen, onClose }: PhoneUIProps) {
  const [phoneState, setPhoneState] = useState<PhoneState>("idle")
  const [dialedNumber, setDialedNumber] = useState("")
  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [currentDialogue, setCurrentDialogue] = useState<DialogueNode | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (phoneState === "connected") {
      interval = setInterval(() => setDialedNumber((t) => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [phoneState])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  const handleDial = (digit: string) => {
    if (dialedNumber.length < 8) {
      const newNumber = dialedNumber + digit
      if (newNumber.length === 3 && dialedNumber.length < 3) {
        setDialedNumber(newNumber + "-")
      } else {
        setDialedNumber(newNumber)
      }
    }
  }

  const handleClear = () => setDialedNumber((prev) => prev.slice(0, -1))

  const handleCall = () => {
    if (dialedNumber.length >= 7) {
      const contact = CONTACTS.find((c) => c.phoneNumber === dialedNumber)
      if (contact) {
        setActiveContact(contact)
        setPhoneState("dialing")
        setTimeout(() => {
          setPhoneState("ringing")
          setTimeout(() => {
            if (contact.available) {
              startConversation(contact)
            } else {
              setPhoneState("idle")
              setActiveContact(null)
            }
          }, 2000)
        }, 1500)
      }
    }
  }

  const callContact = (contact: Contact) => {
    setActiveContact(contact)
    setDialedNumber(contact.phoneNumber)
    setPhoneState("dialing")
    setTimeout(() => {
      setPhoneState("ringing")
      setTimeout(() => {
        if (contact.available) {
          startConversation(contact)
        } else {
          setPhoneState("idle")
          setActiveContact(null)
        }
      }, 2000)
    }, 1500)
  }

  const startConversation = (contact: Contact) => {
    const conversation = CONVERSATIONS.find((c) => c.contactId === contact.id)
    if (conversation) {
      const startNode = conversation.nodes.find((n) => n.id === conversation.startNodeId)
      if (startNode) {
        setCurrentDialogue(startNode)
        setPhoneState("connected")
      }
    } else {
      setPhoneState("connected")
    }
  }

  const handleAnswer = () => {
    if (activeContact) {
      startConversation(activeContact)
    }
  }

  const handleHangup = () => {
    setPhoneState("idle")
    setDialedNumber("")
    setActiveContact(null)
    setCurrentDialogue(null)
  }

  const handleChoice = (nextId: string) => {
    if (!activeContact) return
    const conversation = CONVERSATIONS.find((c) => c.contactId === activeContact.id)
    if (!conversation) {
      handleHangup()
      return
    }
    const nextNode = conversation.nodes.find((n) => n.id === nextId)
    if (nextNode) {
      setCurrentDialogue(nextNode)
    }
  }

  const filteredContacts = CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.codename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery),
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-20 md:left-4 z-50 bg-black/80 md:bg-transparent flex items-center justify-center md:block">
      {/* Phone Frame */}
      <div className="bg-[#1a1a1a] rounded-[24px] p-2 border-4 border-[#333] shadow-[6px_6px_0_#000] w-[90vw] max-w-[320px] md:w-auto md:max-w-none">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:-top-2 md:-right-2 w-8 h-8 md:w-6 md:h-6 bg-[#E71D36] rounded-full flex items-center justify-center border-2 border-black text-white text-sm md:text-xs font-bold z-10 hover:bg-red-600"
        >
          ×
        </button>

        {/* Screen */}
        <div className="bg-[#0a0a0a] rounded-[18px] overflow-hidden w-full md:w-[240px]">
          {/* Status Bar */}
          <div className="bg-[#1a1a1a] px-3 md:px-2 py-1 md:py-0.5 flex justify-between items-center text-[10px] md:text-[8px] text-white">
            <span className="font-mono">HERO-NET</span>
            <div className="flex gap-1 items-center">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-green-500 rounded-sm" style={{ width: 2, height: i * 2 + 2 }} />
                ))}
              </div>
              <div className="w-5 md:w-4 h-2.5 md:h-2 border border-white rounded-sm ml-1">
                <div className="w-3/4 h-full bg-green-500 rounded-sm" />
              </div>
            </div>
          </div>

          {/* Phone Content */}
          <div className="h-[70vh] max-h-[500px] md:h-[320px] flex flex-col">
            {/* IDLE - Dialer */}
            {phoneState === "idle" && (
              <div className="flex-1 flex flex-col p-3 md:p-2">
                <div className="bg-[#222] rounded-lg p-2 md:p-1.5 mb-3 md:mb-2 border-2 border-[#444]">
                  <div className="text-white text-lg md:text-base font-mono text-center h-6 md:h-5 tracking-wider">
                    {dialedNumber || "ENTER NUMBER"}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 md:gap-1 mb-3 md:mb-2 flex-1">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handleDial(digit)}
                      className="h-12 md:h-9 rounded-lg bg-[#333] text-white text-xl md:text-base font-bold hover:bg-[#444] active:bg-[#555] border-2 border-[#444] shadow-[2px_2px_0_#000] active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                    >
                      {digit}
                    </button>
                  ))}
                </div>
                <div className="flex justify-center gap-3 md:gap-2">
                  <button
                    onClick={handleClear}
                    className="w-16 md:w-12 h-12 md:h-9 rounded-lg bg-[#E71D36] flex items-center justify-center border-2 border-[#a01525] shadow-[2px_2px_0_#000]"
                  >
                    <svg
                      className="w-5 md:w-4 h-5 md:h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414-6.414a2 2 0 011.414-.586H19a2 2 0 012 2v10a2 2 0 01-2 2h-8.172a2 2 0 01-1.414-.586L3 12z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={handleCall}
                    className="w-16 md:w-12 h-12 md:h-9 rounded-lg bg-green-500 flex items-center justify-center border-2 border-green-700 shadow-[2px_2px_0_#000]"
                  >
                    <svg className="w-5 md:w-4 h-5 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setPhoneState("contacts")}
                    className="w-16 md:w-12 h-12 md:h-9 rounded-lg bg-[#F5BF29] flex items-center justify-center border-2 border-[#c99c1f] shadow-[2px_2px_0_#000]"
                  >
                    <svg className="w-5 md:w-4 h-5 md:h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setPhoneState("incoming")}
                  className="text-[10px] md:text-[8px] text-gray-600 py-2 md:py-1 mt-2 md:mt-1 hover:text-gray-400"
                >
                  [Test: Incoming Call]
                </button>
              </div>
            )}

            {/* CONTACTS LIST */}
            {phoneState === "contacts" && (
              <div className="flex-1 flex flex-col">
                <div className="bg-[#F5BF29] px-3 md:px-2 py-2 md:py-1 flex items-center justify-between border-b-2 border-black">
                  <button onClick={() => setPhoneState("idle")} className="text-black font-bold text-sm md:text-xs">
                    ← BACK
                  </button>
                  <span className="font-bangers text-black text-base md:text-sm tracking-wide">CONTACTS</span>
                  <div className="w-12 md:w-10" />
                </div>
                <div className="p-2 md:p-1 bg-[#222]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 md:px-2 py-2 md:py-1 rounded bg-[#333] text-white text-sm md:text-[10px] border border-[#444] focus:border-[#F5BF29] outline-none"
                  />
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => callContact(contact)}
                      disabled={!contact.available}
                      className={`w-full flex items-center gap-3 md:gap-2 p-3 md:p-1.5 border-b border-[#333] text-left ${contact.available ? "hover:bg-[#222]" : "opacity-50"}`}
                    >
                      <div className="relative">
                        <img
                          src={contact.avatar || "/placeholder.svg"}
                          alt={contact.name}
                          className="w-12 md:w-8 h-12 md:h-8 rounded-full border-2 border-[#444] object-cover"
                        />
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 w-3 md:w-2.5 h-3 md:h-2.5 rounded-full border border-[#0a0a0a] ${contact.available ? "bg-green-500" : "bg-gray-500"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm md:text-[10px] font-bold truncate">
                          {contact.codename ? `"${contact.codename}"` : contact.name}
                        </div>
                        <div className="text-[#F5BF29] text-xs md:text-[9px] font-mono">{contact.phoneNumber}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DIALING */}
            {phoneState === "dialing" && activeContact && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
                <div className="relative">
                  <img
                    src={activeContact.avatar || "/placeholder.svg"}
                    alt={activeContact.name}
                    className="w-24 md:w-16 h-24 md:h-16 rounded-full border-4 border-[#444] object-cover"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-[#F5BF29] animate-ping opacity-30" />
                </div>
                <p className="text-white font-bold mt-3 md:mt-2 text-lg md:text-sm">
                  {activeContact.codename || activeContact.name}
                </p>
                <p className="text-gray-400 text-sm md:text-xs mt-2 animate-pulse">DIALING...</p>
                <button
                  onClick={handleHangup}
                  className="mt-6 md:mt-4 w-14 md:w-10 h-14 md:h-10 rounded-full bg-[#E71D36] flex items-center justify-center border-2 border-[#a01525]"
                >
                  <svg className="w-6 md:w-4 h-6 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                  </svg>
                </button>
              </div>
            )}

            {/* RINGING */}
            {phoneState === "ringing" && activeContact && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
                <img
                  src={activeContact.avatar || "/placeholder.svg"}
                  alt={activeContact.name}
                  className="w-24 md:w-16 h-24 md:h-16 rounded-full border-4 border-green-500 object-cover animate-pulse"
                />
                <p className="text-white font-bold mt-3 md:mt-2 text-lg md:text-sm">
                  {activeContact.codename || activeContact.name}
                </p>
                <div className="flex gap-1 mt-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <p className="text-green-400 text-sm md:text-xs mt-1">RINGING...</p>
                <button
                  onClick={handleHangup}
                  className="mt-6 md:mt-4 w-14 md:w-10 h-14 md:h-10 rounded-full bg-[#E71D36] flex items-center justify-center border-2 border-[#a01525]"
                >
                  <svg className="w-6 md:w-4 h-6 md:h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                  </svg>
                </button>
              </div>
            )}

            {/* INCOMING CALL */}
            {phoneState === "incoming" && activeContact && (
              <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-3 bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]">
                <div className="relative">
                  <img
                    src={activeContact.avatar || "/placeholder.svg"}
                    alt={activeContact.name}
                    className="w-24 md:w-16 h-24 md:h-16 rounded-full border-4 border-[#F5BF29] object-cover"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-[#F5BF29] animate-pulse" />
                </div>
                <p className="text-[#F5BF29] font-bold mt-3 md:mt-2 text-lg md:text-sm">
                  {activeContact.codename || activeContact.name}
                </p>
                <p className="text-white text-sm md:text-xs mt-1">INCOMING CALL</p>
                <div className="flex gap-6 md:gap-4 mt-6 md:mt-4">
                  <button
                    onClick={handleHangup}
                    className="w-16 md:w-12 h-16 md:h-12 rounded-full bg-[#E71D36] flex items-center justify-center border-2 border-[#a01525] shadow-[3px_3px_0_#000]"
                  >
                    <svg className="w-7 md:w-5 h-7 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85-.18.18-.43.28-.7.28-.28 0-.53-.11-.71-.29L.29 13.08c-.18-.17-.29-.42-.29-.7 0-.28.11-.53.29-.71C3.34 8.78 7.46 7 12 7s8.66 1.78 11.71 4.67c.18.18.29.43.29.71 0 .28-.11.53-.29.71l-2.48 2.48c-.18.18-.43.29-.71.29-.27 0-.52-.11-.7-.28-.79-.74-1.69-1.36-2.67-1.85-.33-.16-.56-.5-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                    </svg>
                  </button>
                  <button
                    onClick={handleAnswer}
                    className="w-16 md:w-12 h-16 md:h-12 rounded-full bg-green-500 flex items-center justify-center border-2 border-green-700 shadow-[3px_3px_0_#000] animate-pulse"
                  >
                    <svg className="w-7 md:w-5 h-7 md:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-8 md:gap-6 mt-2 text-[10px] md:text-[8px]">
                  <span className="text-[#E71D36]">DECLINE</span>
                  <span className="text-green-500">ANSWER</span>
                </div>
              </div>
            )}

            {/* CONNECTED - Conversation */}
            {phoneState === "connected" && activeContact && currentDialogue && (
              <div className="flex-1 flex flex-col bg-[#0a0a0a]">
                {/* Header */}
                <div className="bg-[#222] px-3 md:px-2 py-2 md:py-1 flex items-center gap-2 border-b-2 border-[#333]">
                  <img
                    src={activeContact.avatar || "/placeholder.svg"}
                    alt={activeContact.name}
                    className="w-8 md:w-6 h-8 md:h-6 rounded-full border-2 border-green-500 object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm md:text-[10px] font-bold">
                      {activeContact.codename || activeContact.name}
                    </p>
                    <p className="text-green-500 text-[10px] md:text-[8px]">CONNECTED</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>

                {/* Dialogue Area */}
                <div className="flex-1 p-3 md:p-2 overflow-y-auto">
                  {/* Speech Bubble */}
                  <div
                    className={`relative p-3 md:p-2 rounded-lg border-3 md:border-2 border-black shadow-[3px_3px_0_#000] md:shadow-[2px_2px_0_#000] mb-3 md:mb-2 ${
                      currentDialogue.emotion === "angry"
                        ? "bg-red-400"
                        : currentDialogue.emotion === "worried"
                          ? "bg-yellow-400"
                          : currentDialogue.emotion === "happy"
                            ? "bg-green-400"
                            : "bg-white"
                    }`}
                  >
                    <p className="text-black font-bold text-sm md:text-[10px] uppercase leading-relaxed md:leading-tight">
                      {currentDialogue.text}
                    </p>
                    <div className="absolute -bottom-2 left-4 w-0 h-0 border-l-[8px] md:border-l-[6px] border-l-transparent border-r-[8px] md:border-r-[6px] border-r-transparent border-t-[10px] md:border-t-[8px] border-t-black" />
                  </div>

                  {/* Choices or Continue */}
                  {currentDialogue.choices && currentDialogue.choices.length > 0 ? (
                    <div className="space-y-2 md:space-y-1">
                      {currentDialogue.choices.map((choice, index) => (
                        <button
                          key={index}
                          onClick={() => handleChoice(choice.nextId)}
                          className="w-full text-left p-2 md:p-1.5 bg-[#F5BF29] rounded border-2 border-black shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                          <span className="text-black font-bold text-sm md:text-[10px]">
                            [{index + 1}] {choice.text}
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : currentDialogue.nextId ? (
                    <button
                      onClick={() => handleChoice(currentDialogue.nextId!)}
                      className="w-full p-2 md:p-1.5 bg-[#F5BF29] rounded border-2 border-black shadow-[2px_2px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                    >
                      <span className="text-black font-bold text-sm md:text-[10px]">CONTINUE →</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleHangup}
                      className="w-full p-2 md:p-1.5 bg-[#E71D36] rounded border-2 border-black shadow-[2px_2px_0_#000]"
                    >
                      <span className="text-white font-bold text-sm md:text-[10px]">END CALL</span>
                    </button>
                  )}
                </div>

                {/* Hangup Button */}
                <div className="p-2 md:p-1 border-t-2 border-[#333]">
                  <button
                    onClick={handleHangup}
                    className="w-full h-10 md:h-7 rounded-lg bg-[#E71D36] text-white font-bold text-sm md:text-xs border-2 border-[#a01525]"
                  >
                    HANG UP
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Home Button */}
        <div className="flex justify-center mt-2 md:mt-1">
          <div className="w-10 md:w-8 h-10 md:h-8 rounded-full bg-[#222] border-2 border-[#333]" />
        </div>
      </div>
    </div>
  )
}
