"use client"

import { useState, useEffect } from "react"
import {
  Mail,
  Globe,
  Users,
  DollarSign,
  Paperclip,
  Star,
  X,
  Monitor,
  Swords,
  FlaskConical,
  Settings,
  Trash2,
} from "lucide-react"
import {
  SAMPLE_EMAILS,
  WEB_BOOKMARKS,
  WEB_ARTICLES,
  SAMPLE_PERSONNEL,
  SAMPLE_FINANCES,
  type Email,
  type PersonnelMember,
} from "@/lib/laptop-data"

type LaptopApp = "email" | "news" | "personnel" | "finance" | "web" | "combat-lab" | "combat-test"
type PersonnelTab = "team" | "vigilante" | "criminal" | "prisoner"
type FinanceTab = "income" | "salaries" | "lawsuits" | "health" | "pensions" | "insurance"

interface LaptopUIProps {
  isOpen: boolean
  onClose: () => void
  onPauseTime?: () => void
  onResumeTime?: () => void
  gameTime?: Date
  gameDay?: number
  gameYear?: number
}

export function LaptopUI({
  isOpen,
  onClose,
  onPauseTime,
  onResumeTime,
  gameTime = new Date(),
  gameDay = 1,
  gameYear = 1,
}: LaptopUIProps) {
  const [activeApp, setActiveApp] = useState<LaptopApp | null>(null)
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [selectedSite, setSelectedSite] = useState<string>("bnn")
  const [personnelTab, setPersonnelTab] = useState<PersonnelTab>("team")
  const [selectedPerson, setSelectedPerson] = useState<PersonnelMember | null>(null)
  const [financeTab, setFinanceTab] = useState<FinanceTab>("income")
  const [emails, setEmails] = useState(SAMPLE_EMAILS)

  useEffect(() => {
    if (isOpen && onPauseTime) {
      onPauseTime()
    }
    return () => {
      if (onResumeTime) onResumeTime()
    }
  }, [isOpen, onPauseTime, onResumeTime])

  if (!isOpen) return null

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email)
    setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, read: true } : e)))
  }

  const handleEmailChoice = (choiceId: string) => {
    console.log("Email choice selected:", choiceId)
    setSelectedEmail(null)
  }

  const filteredPersonnel = SAMPLE_PERSONNEL.filter((p) => p.category === personnelTab)
  const currentArticles = WEB_ARTICLES.filter((a) => a.siteId === selectedSite)

  const getFinanceTotal = (category: FinanceTab) => {
    return SAMPLE_FINANCES.filter((f) => f.category === category).reduce((sum, f) => sum + f.amount, 0)
  }

  const formatMoney = (amount: number) => {
    const prefix = amount >= 0 ? "" : "-"
    return `${prefix}$${Math.abs(amount).toLocaleString()}`
  }

  // Get team members for relationship display
  const teamMembers = SAMPLE_PERSONNEL.filter((p) => p.category === "team")

  const formatTaskbarTime = () => {
    const hours = gameTime.getHours()
    const minutes = gameTime.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`
  }

  const formatTaskbarDate = () => {
    return `Day ${gameDay} | Year ${gameYear}`
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 z-40" onClick={onClose} />

      {/* Laptop Container - Made fullscreen */}
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Laptop Screen - Full width/height */}
        <div className="flex-1 bg-[#1a1a1a] flex flex-col">
          {/* Screen content - Full screen */}
          <div className="flex-1 bg-[#2a4a7a] overflow-hidden flex flex-col">
            {/* Top bar with branding */}
            <div className="bg-gradient-to-r from-[#1a3a5a] to-[#2a4a7a] px-4 py-2 flex items-center justify-between border-b-2 border-[#F5BF29]">
              {/* Left - Branding */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#F5BF29] rounded flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg tracking-wider">SENTINEL OS</h1>
                  <p className="text-cyan-300 text-[10px] uppercase tracking-widest">Tactical Operations System v3.2</p>
                </div>
              </div>

              {/* Right - Window controls */}
              <div className="flex items-center gap-2">
                <button className="w-3 h-3 rounded-full bg-yellow-400 hover:bg-yellow-300" />
                <button className="w-3 h-3 rounded-full bg-green-400 hover:bg-green-300" />
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-400 hover:bg-red-300" />
              </div>
            </div>

            {/* App icons row */}
            <div className="bg-[#1e3d5f] px-4 py-3 flex gap-3 border-b border-[#2a4a7a]">
              {[
                { id: "email" as LaptopApp, icon: Mail, label: "EMAIL" },
                { id: "web" as LaptopApp, icon: Globe, label: "WEB" },
                { id: "news" as LaptopApp, icon: Globe, label: "NEWS" },
                { id: "personnel" as LaptopApp, icon: Users, label: "PERSONNEL" },
                { id: "finance" as LaptopApp, icon: DollarSign, label: "FINANCE" },
                { id: "combat-lab" as LaptopApp, icon: FlaskConical, label: "COMBAT LAB" },
                { id: "combat-test" as LaptopApp, icon: Swords, label: "COMBAT TEST" },
              ].map((app) => (
                <button
                  key={app.id}
                  onClick={() => setActiveApp(activeApp === app.id ? null : app.id)}
                  className={`flex flex-col items-center p-2 rounded transition-all ${
                    activeApp === app.id
                      ? "bg-white text-[#3355cc]"
                      : "bg-[#3355cc] text-white border-2 border-white hover:bg-[#4466dd]"
                  }`}
                >
                  <app.icon className="w-8 h-8" />
                  <span className="text-xs font-bold mt-1">{app.label}</span>
                </button>
              ))}
            </div>

            {/* Main content area */}
            <div className="flex-1 bg-gray-100 overflow-hidden">
              {!activeApp && (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-[#F5BF29] rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Monitor className="w-12 h-12 text-black" />
                    </div>
                    <p className="text-2xl font-bold text-gray-600">Welcome to SENTINEL OS</p>
                    <p className="text-sm mt-2">Select an application to begin</p>
                  </div>
                </div>
              )}

              {/* EMAIL APP - Split panel layout with inbox on left, email on right */}
              {activeApp === "email" && (
                <div className="h-full flex">
                  {/* Left side - Email inbox list */}
                  <div className="w-1/3 border-r-2 border-gray-300 flex flex-col bg-white">
                    <div className="bg-gray-200 border-b border-gray-300 px-3 py-2 flex items-center justify-between">
                      <span className="font-bold text-sm text-gray-700">INBOX</span>
                      <span className="text-xs text-gray-500">{emails.filter((e) => !e.read).length} unread</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      {emails.map((email) => (
                        <div
                          key={email.id}
                          onClick={() => handleEmailClick(email)}
                          className={`px-3 py-2 border-b border-gray-200 cursor-pointer hover:bg-blue-50 ${
                            selectedEmail?.id === email.id ? "bg-blue-100 border-l-4 border-l-blue-500" : ""
                          } ${!email.read ? "bg-blue-50 font-semibold" : ""}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${email.read ? "bg-gray-300" : "bg-blue-500"}`}
                            />
                            <div
                              className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                email.priority === "HIGH"
                                  ? "bg-red-500"
                                  : email.priority === "MEDIUM"
                                    ? "bg-yellow-500"
                                    : "bg-gray-400"
                              }`}
                            />
                            <span className="text-sm truncate font-medium">{email.sender}</span>
                          </div>
                          <div className="text-sm truncate text-gray-700 flex items-center gap-1">
                            {email.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400 flex-shrink-0" />}
                            {email.subject}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{email.received}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side - Email content */}
                  <div className="flex-1 flex flex-col bg-gray-50">
                    {!selectedEmail ? (
                      <div className="flex-1 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg">Select an email to read</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Email header */}
                        <div className="bg-white border-b border-gray-300 p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h2 className="text-xl font-bold text-gray-800 mb-1">{selectedEmail.subject}</h2>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="font-medium">{selectedEmail.sender}</span>
                                <span className="text-gray-400">|</span>
                                <span>{selectedEmail.received}</span>
                                {selectedEmail.hasAttachment && (
                                  <>
                                    <span className="text-gray-400">|</span>
                                    <span className="flex items-center gap-1">
                                      <Paperclip className="w-4 h-4" /> Attachment
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={`px-2 py-1 rounded text-xs font-bold ${
                                  selectedEmail.priority === "HIGH"
                                    ? "bg-red-100 text-red-700"
                                    : selectedEmail.priority === "MEDIUM"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {selectedEmail.priority}
                              </div>
                              <button
                                onClick={() => {
                                  setEmails((prev) => prev.filter((e) => e.id !== selectedEmail.id))
                                  setSelectedEmail(null)
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded"
                                title="Delete email"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Email body */}
                        <div className="flex-1 overflow-y-auto p-4">
                          <div className="bg-white rounded-lg shadow p-4 text-gray-700 whitespace-pre-line text-sm leading-relaxed">
                            {selectedEmail.body}
                          </div>

                          {/* Email choices - response options at bottom */}
                          {selectedEmail.choices && selectedEmail.choices.length > 0 && (
                            <div className="mt-4 bg-white rounded-lg shadow p-4 border-2 border-blue-200">
                              <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
                                Choose Your Response:
                              </p>
                              <div className="flex flex-col gap-2">
                                {selectedEmail.choices.map((choice, index) => (
                                  <button
                                    key={choice.id}
                                    onClick={() => handleEmailChoice(choice.id)}
                                    className="text-left px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-300 text-sm text-blue-800 transition-all flex items-center gap-3"
                                  >
                                    <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {index + 1}
                                    </span>
                                    <span>{choice.text}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* WEB APP */}
              {activeApp === "web" && (
                <div className="h-full flex flex-col">
                  {/* Browser tabs */}
                  <div className="bg-gray-200 px-2 py-1 flex gap-1 border-b border-gray-300">
                    {WEB_BOOKMARKS.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => setSelectedSite(site.id)}
                        className={`px-3 py-1 rounded-t text-xs font-bold transition-colors ${
                          selectedSite === site.id
                            ? "bg-white text-[#3355cc] border-t-2 border-x-2 border-[#3355cc]"
                            : "bg-gray-300 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {site.icon} {site.name}
                      </button>
                    ))}
                  </div>
                  {/* URL bar */}
                  <div className="bg-white px-3 py-2 border-b border-gray-300 flex items-center gap-2">
                    <span className="text-green-600 text-xs">🔒</span>
                    <div className="flex-1 bg-gray-100 rounded px-2 py-1 text-gray-600 text-sm">
                      https://{WEB_BOOKMARKS.find((s) => s.id === selectedSite)?.url || ""}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-4 bg-white">
                    {currentArticles.map((article) => (
                      <article key={article.id} className="mb-4 border-b border-gray-200 pb-4">
                        <h2 className="font-bold text-lg text-gray-900 mb-1">{article.title}</h2>
                        <p className="text-xs text-gray-500 mb-2">{article.date}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{article.content}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* NEWS APP */}
              {activeApp === "news" && (
                <div className="h-full flex flex-col">
                  {/* Browser tabs */}
                  <div className="bg-gray-200 px-2 py-1 flex gap-1 border-b border-gray-300">
                    {WEB_BOOKMARKS.map((site) => (
                      <button
                        key={site.id}
                        onClick={() => setSelectedSite(site.id)}
                        className={`px-3 py-1 rounded-t text-xs font-bold transition-colors ${
                          selectedSite === site.id
                            ? "bg-white text-[#3355cc] border-t-2 border-x-2 border-[#3355cc]"
                            : "bg-gray-300 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {site.icon} {site.name}
                      </button>
                    ))}
                  </div>
                  {/* URL bar */}
                  <div className="bg-white px-3 py-2 border-b border-gray-300 flex items-center gap-2">
                    <span className="text-green-600 text-xs">🔒</span>
                    <div className="flex-1 bg-gray-100 rounded px-2 py-1 text-gray-600 text-sm">
                      https://{WEB_BOOKMARKS.find((s) => s.id === selectedSite)?.url || ""}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-4 bg-white">
                    {currentArticles.map((article) => (
                      <article key={article.id} className="mb-4 border-b border-gray-200 pb-4">
                        <h2 className="font-bold text-lg text-gray-900 mb-1">{article.title}</h2>
                        <p className="text-xs text-gray-500 mb-2">{article.date}</p>
                        <p className="text-sm text-gray-700 whitespace-pre-line">{article.content}</p>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {/* PERSONNEL APP */}
              {activeApp === "personnel" && (
                <div className="h-full flex flex-col">
                  {/* Header with selected person info */}
                  <div className="bg-[#1a1a2e] text-white px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 text-sm">
                        {personnelTab === "team"
                          ? "TEAM MEMBERS"
                          : personnelTab === "vigilante"
                            ? "VIGILANTES"
                            : personnelTab === "criminal"
                              ? "SUPER CRIMINALS"
                              : "PRISONERS"}
                      </span>
                      {selectedPerson && (
                        <>
                          <span className="text-[#F5BF29] font-bold text-xl">
                            {selectedPerson.codename || selectedPerson.name}
                          </span>
                          <span className="text-gray-400">|</span>
                          <span className="text-sm">
                            STATUS: <span className="text-green-400">{selectedPerson.status}</span>
                          </span>
                          {selectedPerson.location && (
                            <>
                              <span className="text-gray-400">|</span>
                              <span className="text-sm">
                                LOCATION: <span className="text-blue-400">{selectedPerson.location}</span>
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                    {/* Tab buttons */}
                    <div className="flex gap-1">
                      {(["team", "vigilante", "criminal", "prisoner"] as PersonnelTab[]).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setPersonnelTab(tab)
                            setSelectedPerson(null)
                          }}
                          className={`px-2 py-1 text-xs font-bold rounded transition-colors ${
                            personnelTab === tab
                              ? "bg-[#F5BF29] text-black"
                              : "bg-gray-700 text-white hover:bg-gray-600"
                          }`}
                        >
                          {tab.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Personnel grid - like the gangster screen */}
                  <div className="flex-1 overflow-y-auto bg-[#0d0d1a] p-4">
                    {personnelTab === "team" && !selectedPerson && (
                      <>
                        {/* Team feelings matrix header */}
                        <div className="mb-4 text-center">
                          <h3 className="text-[#F5BF29] font-bold text-lg mb-2">TEAM RELATIONSHIPS</h3>
                          <p className="text-gray-400 text-xs">Click a team member to view their full profile</p>
                        </div>
                      </>
                    )}

                    {/* Portrait grid */}
                    <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
                      {filteredPersonnel.map((person) => (
                        <div
                          key={person.id}
                          onClick={() => setSelectedPerson(person)}
                          className={`relative cursor-pointer group transition-transform hover:scale-105 ${
                            selectedPerson?.id === person.id
                              ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d0d1a] rounded-full"
                              : ""
                          }`}
                        >
                          {/* Portrait */}
                          <div className="relative">
                            <img
                              src={person.avatar || "/placeholder.svg"}
                              alt={person.name}
                              className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-gray-600 group-hover:border-[#F5BF29]"
                            />
                            {/* Status indicator */}
                            <div
                              className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-[#0d0d1a] ${
                                person.status === "Active" || person.status === "On Mission"
                                  ? "bg-green-500"
                                  : person.status === "Training" || person.status === "Research"
                                    ? "bg-yellow-500"
                                    : person.status === "At Large"
                                      ? "bg-red-500"
                                      : "bg-gray-500"
                              }`}
                            />
                            {/* Popularity star */}
                            <div className="absolute bottom-0 right-0 flex items-center bg-black/70 rounded-full px-1">
                              <Star className="w-3 h-3 text-[#F5BF29] fill-[#F5BF29]" />
                              <span className="text-white text-[10px] ml-0.5">
                                {Math.round(person.popularity / 20)}
                              </span>
                            </div>
                          </div>
                          {/* Name */}
                          <p className="text-white text-[10px] text-center mt-1 truncate">
                            {person.codename || person.name}
                          </p>
                          {/* Feelings emojis for team */}
                          {personnelTab === "team" && person.feelings && person.feelings.length > 0 && (
                            <div className="flex justify-center gap-0.5 mt-0.5">
                              {person.feelings.slice(0, 3).map((f, idx) => (
                                <span key={idx} className="text-xs" title={`Feeling toward teammate`}>
                                  {f.emoji}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Selected person detail panel */}
                    {selectedPerson && (
                      <div className="mt-4 bg-[#1a1a2e] rounded-lg p-4 border border-gray-700">
                        <div className="flex gap-4">
                          {/* Portrait */}
                          <div className="flex-shrink-0">
                            <img
                              src={selectedPerson.avatar || "/placeholder.svg"}
                              alt={selectedPerson.name}
                              className="w-24 h-24 rounded-lg object-cover border-2 border-[#F5BF29]"
                            />
                            {selectedPerson.age && selectedPerson.age > 0 && (
                              <p className="text-center text-gray-400 text-xs mt-1">Age: {selectedPerson.age}</p>
                            )}
                          </div>
                          {/* Info */}
                          <div className="flex-1">
                            <h3 className="text-[#F5BF29] font-bold text-xl">
                              {selectedPerson.codename || selectedPerson.name}
                            </h3>
                            <p className="text-gray-400 text-sm">{selectedPerson.name}</p>

                            {/* Stats grid */}
                            <div className="grid grid-cols-6 gap-2 mt-3">
                              {Object.entries(selectedPerson.stats).map(([stat, value]) => (
                                <div key={stat} className="text-center">
                                  <p className="text-[#F5BF29] text-[10px] uppercase">{stat.slice(0, 3)}</p>
                                  <p className="text-white font-bold">{value}</p>
                                </div>
                              ))}
                            </div>

                            {/* Powers */}
                            <div className="mt-3">
                              <p className="text-gray-400 text-xs mb-1">POWERS:</p>
                              <div className="flex flex-wrap gap-1">
                                {selectedPerson.powers.map((power) => (
                                  <span key={power} className="px-2 py-0.5 bg-[#3355cc] text-white text-xs rounded">
                                    {power}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Popularity bar */}
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-gray-400">POPULARITY</span>
                                <span className="text-white">{selectedPerson.popularity}%</span>
                              </div>
                              <div className="h-2 bg-gray-700 rounded overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                                  style={{ width: `${selectedPerson.popularity}%` }}
                                />
                              </div>
                            </div>

                            {/* Team feelings toward this person */}
                            {personnelTab === "team" && (
                              <div className="mt-3">
                                <p className="text-gray-400 text-xs mb-1">TEAM FEELINGS:</p>
                                <div className="flex gap-2">
                                  {teamMembers
                                    .filter((tm) => tm.id !== selectedPerson.id)
                                    .map((tm) => {
                                      const feeling = tm.feelings?.find((f) => f.targetId === selectedPerson.id)
                                      return (
                                        <div key={tm.id} className="flex flex-col items-center">
                                          <img
                                            src={tm.avatar || "/placeholder.svg"}
                                            alt={tm.name}
                                            className="w-8 h-8 rounded-full object-cover border border-gray-600"
                                          />
                                          <span className="text-sm">{feeling?.emoji || "😐"}</span>
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Action buttons */}
                          <div className="flex flex-col gap-2">
                            {personnelTab === "team" && (
                              <>
                                <button className="px-3 py-1.5 bg-[#F5BF29] text-black font-bold text-xs rounded hover:bg-[#ffd000]">
                                  VIEW FULL PROFILE
                                </button>
                                <button className="px-3 py-1.5 bg-green-600 text-white font-bold text-xs rounded hover:bg-green-500">
                                  ASSIGN MISSION
                                </button>
                              </>
                            )}
                            {personnelTab === "vigilante" && (
                              <button className="px-3 py-1.5 bg-green-600 text-white font-bold text-xs rounded hover:bg-green-500">
                                SEND RECRUITMENT EMAIL
                              </button>
                            )}
                            {personnelTab === "criminal" && (
                              <button className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs rounded hover:bg-red-500">
                                TRACK LOCATION
                              </button>
                            )}
                            {personnelTab === "prisoner" && (
                              <button className="px-3 py-1.5 bg-blue-600 text-white font-bold text-xs rounded hover:bg-blue-500">
                                INTERROGATE
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedPerson(null)}
                              className="px-3 py-1.5 bg-gray-600 text-white font-bold text-xs rounded hover:bg-gray-500"
                            >
                              CLOSE
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* FINANCE APP */}
              {activeApp === "finance" && (
                <div className="h-full flex flex-col">
                  {/* Finance header with totals */}
                  <div className="bg-[#1a1a2e] text-white px-4 py-2 flex items-center justify-between">
                    <div className="flex gap-4">
                      {(["income", "salaries", "lawsuits", "health", "pensions", "insurance"] as FinanceTab[]).map(
                        (tab) => (
                          <button
                            key={tab}
                            onClick={() => setFinanceTab(tab)}
                            className={`px-3 py-1 text-xs font-bold rounded transition-colors ${
                              financeTab === tab
                                ? "bg-[#F5BF29] text-black"
                                : "bg-gray-700 text-white hover:bg-gray-600"
                            }`}
                          >
                            {tab.toUpperCase()}
                          </button>
                        ),
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">TOTAL {financeTab.toUpperCase()}</p>
                      <p
                        className={`font-bold ${getFinanceTotal(financeTab) >= 0 ? "text-green-400" : "text-red-400"}`}
                      >
                        {formatMoney(getFinanceTotal(financeTab))}
                      </p>
                    </div>
                  </div>

                  {/* Finance table */}
                  <div className="flex-1 overflow-y-auto bg-white">
                    <table className="w-full">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left px-4 py-2 text-sm font-bold text-gray-600">DESCRIPTION</th>
                          <th className="text-right px-4 py-2 text-sm font-bold text-gray-600">AMOUNT</th>
                          <th className="text-right px-4 py-2 text-sm font-bold text-gray-600">FREQUENCY</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SAMPLE_FINANCES.filter((f) => f.category === financeTab).map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm">{entry.description}</td>
                            <td
                              className={`px-4 py-2 text-sm text-right font-mono ${
                                entry.amount >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {formatMoney(entry.amount)}
                            </td>
                            <td className="px-4 py-2 text-sm text-right text-gray-500 capitalize">
                              {entry.recurring || "one-time"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Finance summary */}
                  <div className="bg-gray-100 border-t border-gray-300 px-4 py-3 flex justify-between items-center">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <p className="text-xs text-gray-500">TOTAL INCOME</p>
                        <p className="text-green-600 font-bold">{formatMoney(getFinanceTotal("income"))}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">TOTAL EXPENSES</p>
                        <p className="text-red-600 font-bold">
                          {formatMoney(
                            getFinanceTotal("salaries") +
                              getFinanceTotal("lawsuits") +
                              getFinanceTotal("health") +
                              getFinanceTotal("pensions") +
                              getFinanceTotal("insurance"),
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">NET BALANCE</p>
                        <p
                          className={`font-bold ${
                            getFinanceTotal("income") +
                              getFinanceTotal("salaries") +
                              getFinanceTotal("lawsuits") +
                              getFinanceTotal("health") +
                              getFinanceTotal("pensions") +
                              getFinanceTotal("insurance") >=
                            0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatMoney(
                            getFinanceTotal("income") +
                              getFinanceTotal("salaries") +
                              getFinanceTotal("lawsuits") +
                              getFinanceTotal("health") +
                              getFinanceTotal("pensions") +
                              getFinanceTotal("insurance"),
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* COMBAT LAB SCREEN */}
              {activeApp === "combat-lab" && (
                <div className="h-full flex flex-col bg-[#1a1a2e] text-white">
                  <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-4 py-3 border-b border-purple-500">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-purple-300" />
                      COMBAT LABORATORY
                    </h2>
                    <p className="text-purple-300 text-xs">Upgrade abilities, research tech, and enhance your team</p>
                  </div>
                  <div className="flex-1 p-4 overflow-auto">
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { name: "Strength Training", progress: 75, cost: "$50,000" },
                        { name: "Combat Techniques", progress: 45, cost: "$75,000" },
                        { name: "Tech Upgrades", progress: 30, cost: "$100,000" },
                        { name: "Armor Research", progress: 60, cost: "$80,000" },
                        { name: "Weapon Systems", progress: 20, cost: "$120,000" },
                        { name: "Medical Bay", progress: 90, cost: "$40,000" },
                      ].map((item) => (
                        <div key={item.name} className="bg-[#2a2a4e] rounded-lg p-4 border border-purple-500/30">
                          <h3 className="font-bold text-sm mb-2">{item.name}</h3>
                          <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${item.progress}%` }} />
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{item.progress}%</span>
                            <button className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-xs rounded">
                              {item.cost}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* COMBAT TEST SCREEN */}
              {activeApp === "combat-test" && (
                <div className="h-full flex flex-col bg-[#1a1a1a] text-white">
                  <div className="bg-gradient-to-r from-red-900 to-orange-900 px-4 py-3 border-b border-red-500">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                      <Swords className="w-5 h-5 text-red-300" />
                      COMBAT SIMULATOR
                    </h2>
                    <p className="text-red-300 text-xs">Test your team against simulated threats</p>
                  </div>
                  <div className="flex-1 p-4 overflow-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-red-500/30">
                        <h3 className="font-bold mb-3 text-red-400">SELECT TEAM</h3>
                        <div className="space-y-2">
                          {["Stampede", "CrossFire", "Nightshade", "Techna"].map((hero) => (
                            <label
                              key={hero}
                              className="flex items-center gap-2 p-2 bg-[#333] rounded cursor-pointer hover:bg-[#444]"
                            >
                              <input type="checkbox" className="accent-red-500" />
                              <span className="text-sm">{hero}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-orange-500/30">
                        <h3 className="font-bold mb-3 text-orange-400">SELECT SCENARIO</h3>
                        <div className="space-y-2">
                          {[
                            { name: "Bank Heist", difficulty: "Easy" },
                            { name: "Hostage Situation", difficulty: "Medium" },
                            { name: "Supervillain Attack", difficulty: "Hard" },
                            { name: "Alien Invasion", difficulty: "Extreme" },
                          ].map((scenario) => (
                            <button
                              key={scenario.name}
                              className="w-full p-2 bg-[#333] rounded text-left hover:bg-[#444] flex justify-between items-center"
                            >
                              <span className="text-sm">{scenario.name}</span>
                              <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                  scenario.difficulty === "Easy"
                                    ? "bg-green-600"
                                    : scenario.difficulty === "Medium"
                                      ? "bg-yellow-600"
                                      : scenario.difficulty === "Hard"
                                        ? "bg-orange-600"
                                        : "bg-red-600"
                                }`}
                              >
                                {scenario.difficulty}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 font-bold rounded-lg text-lg">
                      START SIMULATION
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom taskbar */}
            <div className="bg-gradient-to-r from-[#1a3a5a] to-[#2a4a7a] px-4 py-2 flex items-center justify-between border-t-2 border-[#F5BF29]">
              {/* Left - Start menu style buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  EXIT
                </button>
                <button className="px-3 py-1.5 bg-[#3355cc] hover:bg-[#4466dd] text-white font-bold text-xs rounded flex items-center gap-1">
                  <Settings className="w-3 h-3" />
                  SETTINGS
                </button>
              </div>

              {/* Center - Branding */}
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-[#F5BF29] rounded flex items-center justify-center">
                  <Monitor className="w-3 h-3 text-black" />
                </div>
                <span className="text-white text-xs font-bold tracking-wider">SENTINEL OS</span>
              </div>

              {/* Right - Date and Time */}
              <div className="flex items-center gap-3 text-white">
                <div className="text-right">
                  <p className="text-xs font-mono">{formatTaskbarTime()}</p>
                  <p className="text-[10px] text-gray-400">{formatTaskbarDate()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Laptop base/keyboard */}
        <div className="h-6 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-b-lg border-4 border-t-0 border-[#333] flex items-center justify-center">
          <div className="w-24 h-1 bg-[#444] rounded-full" />
        </div>
      </div>
    </>
  )
}
