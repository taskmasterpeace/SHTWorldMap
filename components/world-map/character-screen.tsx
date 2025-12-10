"use client"

import { useState } from "react"
import Image from "next/image"
import {
  type GameCharacter,
  type Origin,
  ORIGINS,
  WEAPONS,
  ARMORS,
  POWERS,
  GADGETS,
  calculateSecondaryStats,
  createNewCharacter,
} from "@/lib/character-data"

interface CharacterScreenProps {
  initialCharacter?: GameCharacter
  onClose?: () => void
  onSave?: (character: GameCharacter) => void
  characters?: GameCharacter[]
  onChangeCharacter?: (character: GameCharacter) => void
}

// Extended character data for the full 15 categories
interface ExtendedCharacter extends GameCharacter {
  age: number
  nationality: string
  faction: string
  melee: number
  agility: number
  strength: number
  intellect: number
  instinct: number
  mental: number
  health: number
  defense: number
  dodge: number
  evasion: number
  initiative: number
  career: string
  education: string
  skills: { name: string; level: number; icon: string }[]
  attributes: { name: string; positive: boolean }[]
  paymentWeekly: number
  paymentYearly: number
  cityFamiliarity: { city: string; flag: string; level: number }[]
  birthplace: string
  training: { name: string; percent: number }[]
  experience: { name: string; percent: number }[]
  gearReady: string[]
  gearContainer: string[]
  gearPersonal: string[]
  educationList: { name: string; level: number }[]
}

type GearTab = "ready" | "personal" | "container"

export function CharacterScreen({
  initialCharacter,
  onSave,
  onClose,
  characters = [],
  onChangeCharacter,
}: CharacterScreenProps) {
  // Create extended character from initial
  const createExtendedCharacter = (char?: GameCharacter): ExtendedCharacter => {
    const base = char ? { ...createNewCharacter(), ...char } : createNewCharacter()
    const secondary = calculateSecondaryStats(base.primaryStats, (base.origin as Origin) || "skilled_human")

    return {
      ...base,
      origin: base.origin && ORIGINS[base.origin as Origin] ? (base.origin as Origin) : "skilled_human",
      age: 32,
      nationality: "India",
      faction: "Independent",
      melee: base.primaryStats?.str ? Math.floor(base.primaryStats.str / 2) : 24,
      agility: base.primaryStats?.agl || 56,
      strength: base.primaryStats?.str || 52,
      intellect: base.primaryStats?.rsn || 24,
      instinct: base.primaryStats?.int || 23,
      mental: base.primaryStats?.psy || 16,
      health: secondary.hp || 23,
      defense: 12,
      dodge: -1,
      evasion: -2,
      initiative: secondary.initiative || 23,
      career: "Fisheries and Wildlife Science",
      education: "Fisheries and Wildlife Science",
      skills: [
        { name: "Combat", level: 5, icon: "🥋" },
        { name: "Martial Arts", level: 10, icon: "🥊" },
        { name: "Tactics", level: 3, icon: "🎖️" },
        { name: "Leadership", level: 4, icon: "👑" },
      ],
      attributes: [
        { name: "Light Sleeper", positive: true },
        { name: "Workaholic", positive: true },
        { name: "Heavy Smoker", positive: false },
        { name: "Hates Agility Training", positive: false },
      ],
      paymentWeekly: 1731,
      paymentYearly: 90000,
      cityFamiliarity: [
        { city: "Miami", flag: "🇺🇸", level: 80 },
        { city: "Denver", flag: "🇺🇸", level: 60 },
      ],
      birthplace: "Miami, USA",
      training: [
        { name: "Agility Training", percent: 84 },
        { name: "Martial Arts", percent: 13 },
      ],
      experience: [
        { name: "Wrestling", percent: 84 },
        { name: "Martial Arts", percent: 13 },
      ],
      gearReady: base.weapon ? [base.weapon] : ["pistol"],
      gearContainer: ["frag_grenade", "medkit"],
      gearPersonal: [],
      educationList: [
        { name: "Fisheries and Wildlife Science", level: 90 },
        { name: "Marine Biology", level: 75 },
        { name: "Environmental Studies", level: 60 },
      ],
    }
  }

  const [character, setCharacter] = useState<ExtendedCharacter>(createExtendedCharacter(initialCharacter))
  const [gearTab, setGearTab] = useState<GearTab>("ready")
  const [isEditing, setIsEditing] = useState(false)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)

  // Navigate between characters
  const navigateCharacter = (direction: "prev" | "next") => {
    if (!characters || characters.length === 0) return
    let newIndex = direction === "prev" ? currentCharIndex - 1 : currentCharIndex + 1
    if (newIndex < 0) newIndex = characters.length - 1
    if (newIndex >= characters.length) newIndex = 0
    setCurrentCharIndex(newIndex)
    setCharacter(createExtendedCharacter(characters[newIndex]))
    onChangeCharacter?.(characters[newIndex])
  }

  // Get power icons
  const getPowerIcon = (powerId: string) => {
    const power = POWERS.find((p) => p.id === powerId)
    const icons: Record<string, string> = {
      physical: "🔥",
      energy: "⚡",
      mental: "🧠",
      defensive: "🛡️",
      travel: "🚀",
      alteration: "✨",
    }
    return power ? icons[power.category] || "❓" : "❓"
  }

  // Get gear icon
  const getGearIcon = (gearId: string) => {
    const weapon = WEAPONS.find((w) => w.id === gearId)
    const gadget = GADGETS.find((g) => g.id === gearId)
    const armor = ARMORS.find((a) => a.id === gearId)

    if (weapon) {
      const icons: Record<string, string> = {
        sidearm: "🔫",
        rifle: "🎯",
        energy: "⚡",
        melee: "🗡️",
        heavy: "💣",
      }
      return icons[weapon.category] || "🔫"
    }
    if (gadget) return "🎒"
    if (armor) return "🛡️"
    return "📦"
  }

  const currentGear =
    gearTab === "ready"
      ? character.gearReady
      : gearTab === "personal"
        ? character.gearPersonal
        : character.gearContainer

  return (
    <div className="fixed inset-0 bg-[#e8e8e8] z-50 flex flex-col h-screen overflow-hidden">
      {/* Close/Edit buttons */}
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-[#FFD700] border-2 border-black px-3 py-1 font-bangers text-sm hover:bg-yellow-400 shadow-[2px_2px_0_#000]"
        >
          {isEditing ? "SAVE" : "EDIT"}
        </button>
        <button
          onClick={onClose}
          className="bg-red-500 text-white border-2 border-black px-3 py-1 font-bangers text-sm hover:bg-red-600 shadow-[2px_2px_0_#000]"
        >
          BACK
        </button>
      </div>

      {/* Main content with proper grid layout */}
      <div className="flex-1 overflow-auto p-3 md:p-4">
        {/* Desktop: 3-column grid layout */}
        <div className="hidden md:grid md:grid-cols-[auto_1fr_auto] gap-4 max-w-6xl mx-auto">
          {/* LEFT COLUMN - Character Identity */}
          <div className="flex flex-col gap-3">
            {/* Age + Photo + Identity row */}
            <div className="flex items-start gap-2">
              {/* AGE */}
              <div className="flex flex-col">
                <div className="bg-[#FFD700] border-2 border-black px-2 py-0.5 font-bangers text-xs text-center">
                  AGE:
                </div>
                <div className="bg-white border-2 border-black border-t-0 w-14 h-12 flex items-center justify-center font-bangers text-3xl">
                  {character.age}
                </div>
              </div>

              {/* Photo with nav */}
              <div className="relative">
                <button
                  onClick={() => navigateCharacter("prev")}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 text-[#FFD700] text-2xl font-bold z-10 hover:scale-110 drop-shadow-[1px_1px_0_#000]"
                >
                  ◀
                </button>

                <div className="border-3 border-black w-28 h-32 bg-gray-300 overflow-hidden relative shadow-[3px_3px_0_#000]">
                  <Image
                    src={character.avatar || "/superhero-portrait.jpg"}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-1 right-1 text-xl">🇮🇳</div>
                  <div className="absolute top-1 right-1 bg-white border border-black rounded p-0.5">
                    <span className="text-sm">👤</span>
                  </div>
                </div>

                <button
                  onClick={() => navigateCharacter("next")}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 text-[#FFD700] text-2xl font-bold z-10 hover:scale-110 drop-shadow-[1px_1px_0_#000]"
                >
                  ▶
                </button>
              </div>

              {/* Identity */}
              <div className="flex flex-col">
                <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-xs text-center">
                  IDENTITY:
                </div>
                <div className="bg-white border-2 border-black border-t-0 px-4 py-2 font-bangers text-xl text-center">
                  {character.secretIdentity ? "SECRET" : "PUBLIC"}
                </div>
              </div>
            </div>

            {/* Name */}
            <div>
              <div className="bg-[#FFD700] border-2 border-black px-2 font-bangers text-xs inline-block">NAME:</div>
              <div className="bg-white border-2 border-black px-3 py-1 font-bangers text-lg w-full max-w-[280px]">
                {character.name || "Unknown"}
              </div>
            </div>

            {/* POWERS */}
            <div className="flex">
              <div className="flex flex-col gap-1 mr-1">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-3 h-12 bg-[#ff6b6b] border border-black" />
                ))}
              </div>
              <div className="flex-1">
                <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-sm text-center">POWERS</div>
                <div className="bg-[#7cbbeb] border-2 border-black border-t-0 p-2">
                  <div className="grid grid-cols-4 gap-2">
                    {[0, 1, 2, 3].map((i) => {
                      const powerId = character.powers?.[i]
                      return (
                        <div
                          key={i}
                          className="w-12 h-12 bg-[#7cbbeb] border-2 border-black flex items-center justify-center text-2xl cursor-pointer hover:bg-[#6aabdb] shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
                          title={powerId ? POWERS.find((p) => p.id === powerId)?.name : "Empty slot"}
                        >
                          {powerId ? getPowerIcon(powerId) : ""}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* GEAR */}
            <div>
              <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-sm text-center">GEAR</div>
              <div className="bg-[#7cbbeb] border-2 border-black border-t-0 p-2">
                <div className="grid grid-cols-3 grid-rows-2 gap-2 mb-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const gearId = currentGear[i]
                    return (
                      <div
                        key={i}
                        className="w-12 h-12 bg-[#7cbbeb] border-2 border-black flex items-center justify-center text-2xl relative cursor-pointer hover:bg-[#6aabdb] shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
                        title={gearId || "Empty slot"}
                      >
                        {gearId && (
                          <>
                            {getGearIcon(gearId)}
                            {i === 1 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded">
                                2
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex border-2 border-black">
                  {(["ready", "personal", "container"] as GearTab[]).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setGearTab(tab)}
                      className={`flex-1 font-bangers text-xs py-1 border-r border-black last:border-r-0 ${
                        gearTab === tab ? "bg-[#FFD700]" : "bg-white hover:bg-gray-100"
                      }`}
                    >
                      {tab.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN - Stats and Education */}
          <div className="flex flex-col gap-3">
            {/* Stats row */}
            <div className="flex gap-3 justify-center">
              {/* PRIMARY STATS */}
              <div className="bg-[#7cbbeb] border-2 border-black p-2 shadow-[3px_3px_0_#000]">
                <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-sm text-center mb-2">
                  PRIMARY STATS
                </div>
                <div className="space-y-1">
                  {[
                    { label: "MELEE:", value: character.melee },
                    { label: "AGILITY:", value: character.agility },
                    { label: "STRENGTH:", value: character.strength },
                    { label: "INTELLECT:", value: character.intellect },
                    { label: "INSTINCT:", value: character.instinct },
                    { label: "MENTAL:", value: character.mental },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <span className="font-bangers text-xs w-20 text-right">{stat.label}</span>
                      <div className="bg-white border-2 border-black w-10 h-6 flex items-center justify-center font-bangers text-lg">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECONDARY STATS */}
              <div className="bg-[#7cbbeb] border-2 border-black p-2 shadow-[3px_3px_0_#000]">
                <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-sm text-center mb-2">
                  SECONDARY STATS
                </div>
                <div className="flex gap-3 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#FFD700] border border-black px-2 font-bangers text-[10px]">HEALTH</div>
                    <div className="bg-white border-2 border-black w-12 h-12 flex items-center justify-center font-bangers text-2xl">
                      {character.health}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#FFD700] border border-black px-2 font-bangers text-[10px]">DEFENSE</div>
                    <div className="bg-white border-2 border-black w-12 h-12 flex items-center justify-center font-bangers text-2xl">
                      {character.defense}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#FFD700] border border-black px-1 font-bangers text-[8px]">DODGE</div>
                    <div className="bg-[#7cbbeb] border border-black w-10 h-6 flex items-center justify-center font-bangers text-sm">
                      {character.dodge}CS
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#FFD700] border border-black px-1 font-bangers text-[8px]">EVASION</div>
                    <div className="bg-[#7cbbeb] border border-black w-10 h-6 flex items-center justify-center font-bangers text-sm">
                      {character.evasion}CS
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center mt-2">
                  <div className="bg-[#FFD700] border border-black px-2 font-bangers text-[10px]">INITIATIVE</div>
                  <div className="bg-white border-2 border-black w-12 h-10 flex items-center justify-center font-bangers text-xl">
                    {character.initiative}
                  </div>
                </div>
              </div>
            </div>

            {/* Education Card with Birthplace & Career */}
            <div className="bg-[#7cbbeb] border-2 border-black p-2 shadow-[3px_3px_0_#000]">
              <div className="flex gap-4 mb-2">
                {/* Birthplace */}
                <div className="flex-1">
                  <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs text-center">
                    BIRTHPLACE
                  </div>
                  <div className="bg-white border border-black px-2 py-1 font-bangers text-sm text-center flex items-center justify-center gap-2">
                    <span className="text-lg">🇺🇸</span>
                    <span>Miami</span>
                  </div>
                </div>
                {/* Career */}
                <div className="flex-1">
                  <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs text-center">CAREER</div>
                  <div className="bg-white border border-black px-2 py-1 font-bangers text-sm text-center truncate">
                    {character.career}
                  </div>
                </div>
              </div>

              {/* Education list with meters */}
              <div className="flex">
                <div className="flex flex-col gap-[2px] mr-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-5 border border-black ${i < (character.educationList?.length || 3) ? "bg-[#ff6b6b]" : "bg-[#7cbbeb]"}`}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs text-center">
                    EDUCATION
                  </div>
                  <div className="bg-[#5a9bd4] border border-black border-t-0 p-1 space-y-1">
                    {(
                      character.educationList || [
                        { name: "Fisheries and Wildlife Science", level: 90 },
                        { name: "Marine Biology", level: 75 },
                        { name: "Environmental Studies", level: 60 },
                      ]
                    )
                      .slice(0, 6)
                      .map((edu, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="flex-1 bg-white border border-black px-2 py-0.5 text-xs truncate">
                            {edu.name}
                          </div>
                          <div className="w-20 h-4 bg-white border border-black overflow-hidden relative">
                            <div className="h-full bg-[#7cbbeb]" style={{ width: `${edu.level}%` }} />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bangers">
                              {edu.level}%
                            </span>
                          </div>
                        </div>
                      ))}
                    {/* Empty slots */}
                    {Array(Math.max(0, 6 - (character.educationList?.length || 3)))
                      .fill(0)
                      .map((_, i) => (
                        <div key={`empty-edu-${i}`} className="flex items-center gap-2">
                          <div className="flex-1 bg-[#5a9bd4] border border-black/30 h-6" />
                          <div className="w-20 h-4 bg-[#5a9bd4] border border-black/30" />
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Attributes row */}
            <div className="flex gap-3">
              {/* SKILLS */}
              <div className="flex-1">
                <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-sm text-center">SKILLS</div>
                <div className="bg-[#7cbbeb] border-2 border-black border-t-0 p-2">
                  <div className="flex gap-2 justify-center flex-wrap">
                    {character.skills.map((skill, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="text-[8px] text-yellow-600">{"★".repeat(Math.min(skill.level, 5))}</div>
                        <div className="w-10 h-10 bg-white border-2 border-black rounded-full flex items-center justify-center text-lg shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
                          {skill.icon}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ATTRIBUTES */}
              <div className="flex-1">
                <div className="bg-[#FFD700] border-2 border-black px-3 font-bangers text-sm text-center">
                  ATTRIBUTES
                </div>
                <div className="bg-[#7cbbeb] border-2 border-black border-t-0 p-2 min-h-[80px]">
                  <div className="text-xs space-y-0.5">
                    {character.attributes.map((attr, i) => (
                      <div key={i} className={`font-bangers ${attr.positive ? "text-green-700" : "text-red-500"}`}>
                        {attr.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Payment, City Familiarity, Experience & Training */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            {/* PAYMENT */}
            <div className="bg-[#7cbbeb] border-2 border-black p-2 shadow-[3px_3px_0_#000]">
              <div className="font-bangers text-sm text-center mb-1">PAYMENT:</div>
              <div className="bg-white border-2 border-black p-2 text-center">
                <div className="text-red-500 font-bangers text-2xl">${character.paymentWeekly.toLocaleString()}</div>
                <div className="text-xs">per week</div>
              </div>
              <div className="bg-white border-2 border-black p-2 text-center mt-1">
                <div className="text-red-500 font-bangers text-2xl">${character.paymentYearly.toLocaleString()}</div>
                <div className="text-xs">per year</div>
              </div>
            </div>

            {/* CITY FAMILIARITY - with meters */}
            <div className="flex">
              <div className="flex flex-col gap-[2px] mr-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-5 border border-black ${i < character.cityFamiliarity.length ? "bg-[#ff6b6b]" : "bg-[#7cbbeb]"}`}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div className="bg-[#FFD700] border-2 border-black px-2 font-bangers text-sm text-center">
                  CITY FAMILIARITY
                </div>
                <div className="bg-[#5a9bd4] border-2 border-black border-t-0 p-1 space-y-1">
                  {character.cityFamiliarity.map((city, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="text-sm">{city.flag}</span>
                      <span className="font-bangers text-xs flex-1">{city.city}</span>
                      <div className="w-16 h-3 bg-white border border-black overflow-hidden relative">
                        <div className="h-full bg-[#7cbbeb]" style={{ width: `${city.level}%` }} />
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bangers">
                          {city.level}%
                        </span>
                      </div>
                    </div>
                  ))}
                  {Array(6 - character.cityFamiliarity.length)
                    .fill(0)
                    .map((_, i) => (
                      <div key={`empty-city-${i}`} className="h-4 bg-[#5a9bd4] border-b border-black/20" />
                    ))}
                </div>
              </div>
            </div>

            {/* EXPERIENCE & TRAINING - with meters */}
            <div className="flex">
              <div className="flex flex-col gap-[2px] mr-1">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-5 border border-black ${i < (character.training.length + character.experience.length) ? "bg-[#ff6b6b]" : "bg-[#7cbbeb]"}`}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div className="bg-[#FFD700] border-2 border-black px-2 font-bangers text-sm text-center">
                  EXPERIENCE & TRAINING
                </div>
                <div className="bg-[#5a9bd4] border-2 border-black border-t-0 p-1">
                  {/* Training section */}
                  <div className="text-[10px] font-bangers text-black/70 border-b border-black/30 mb-1 pb-0.5">
                    TRAINING
                  </div>
                  <div className="space-y-1 mb-2">
                    {character.training.map((t, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs flex-1 truncate">{t.name}</span>
                        <div className="w-16 h-3 bg-white border border-black overflow-hidden relative">
                          <div className="h-full bg-[#7cbbeb]" style={{ width: `${t.percent}%` }} />
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bangers">
                            {t.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Experience section */}
                  <div className="text-[10px] font-bangers text-black/70 border-b border-black/30 mb-1 pb-0.5">
                    EXPERIENCE
                  </div>
                  <div className="space-y-1">
                    {character.experience.map((e, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <span className="text-xs flex-1 truncate">{e.name}</span>
                        <div className="w-16 h-3 bg-white border border-black overflow-hidden relative">
                          <div className="h-full bg-[#7cbbeb]" style={{ width: `${e.percent}%` }} />
                          <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bangers">
                            {e.percent}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Tabs */}
        <div className="md:hidden">
          {/* Mobile tabs */}
          <div className="flex border-2 border-black mb-2">
            {["Identity", "Stats", "Skills", "Location"].map((tab, i) => (
              <button
                key={tab}
                className={`flex-1 py-2 font-bangers text-sm border-r border-black last:border-r-0 ${i === 0 ? "bg-[#FFD700]" : "bg-white"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Mobile Identity Tab Content */}
          <div className="space-y-3">
            {/* Character photo and basic info */}
            <div className="flex gap-3 items-start">
              <div className="relative">
                <div className="border-2 border-black w-24 h-28 bg-gray-300 overflow-hidden relative">
                  <Image
                    src={character.avatar || "/superhero-portrait.jpg"}
                    alt={character.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <button onClick={() => navigateCharacter("prev")} className="text-[#FFD700] text-xl">
                    ◀
                  </button>
                  <button onClick={() => navigateCharacter("next")} className="text-[#FFD700] text-xl">
                    ▶
                  </button>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <div>
                  <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs inline-block">NAME:</div>
                  <div className="bg-white border border-black px-2 py-1 font-bangers">{character.name}</div>
                </div>
                <div className="flex gap-2">
                  <div>
                    <div className="bg-[#FFD700] border border-black px-1 font-bangers text-[10px]">AGE</div>
                    <div className="bg-white border border-black px-2 font-bangers text-lg">{character.age}</div>
                  </div>
                  <div>
                    <div className="bg-[#FFD700] border border-black px-1 font-bangers text-[10px]">IDENTITY</div>
                    <div className="bg-white border border-black px-2 font-bangers text-sm">
                      {character.secretIdentity ? "SECRET" : "PUBLIC"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Powers and Gear */}
            <div className="flex gap-2">
              <div className="flex-1 bg-[#7cbbeb] border-2 border-black p-2">
                <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs text-center mb-1">
                  POWERS
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-[#5a9bd4] border border-black flex items-center justify-center text-lg"
                    >
                      {character.powers?.[i] ? getPowerIcon(character.powers[i]) : ""}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 bg-[#7cbbeb] border-2 border-black p-2">
                <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs text-center mb-1">GEAR</div>
                <div className="grid grid-cols-3 gap-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="aspect-square bg-[#5a9bd4] border border-black flex items-center justify-center text-lg"
                    >
                      {currentGear[i] ? getGearIcon(currentGear[i]) : ""}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-[#7cbbeb] border-2 border-black p-2">
              <div className="bg-[#FFD700] border border-black px-2 font-bangers text-xs text-center mb-2">STATS</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  { label: "STR", value: character.strength },
                  { label: "AGL", value: character.agility },
                  { label: "INT", value: character.intellect },
                  { label: "HP", value: character.health },
                  { label: "DEF", value: character.defense },
                  { label: "INIT", value: character.initiative },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-[10px] font-bangers">{stat.label}</div>
                    <div className="bg-white border border-black font-bangers text-lg">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
