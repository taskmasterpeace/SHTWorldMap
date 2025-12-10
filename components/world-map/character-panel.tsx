"use client"
import type { Character } from "@/lib/game-data"
// import { PhoneUI } from "./phone-ui"

interface CharacterPanelProps {
  characters: Character[]
  onCharacterSelect?: (character: Character) => void
  selectedCharacterId?: string
}

type TabType = "computer" | "phone" | "map"

export function CharacterPanel({ characters, onCharacterSelect, selectedCharacterId }: CharacterPanelProps) {
  // const [activeTab, setActiveTab] = useState<TabType>("phone")

  const handleCharacterClick = (character: Character) => {
    onCharacterSelect?.(character)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Character Avatars Row */}
      <div className="flex gap-2 p-2">
        {characters.slice(0, 5).map((character) => (
          <button
            key={character.id}
            onClick={() => handleCharacterClick(character)}
            className={`relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all ${
              selectedCharacterId === character.id
                ? "border-[#E71D36] ring-2 ring-[#E71D36]"
                : "border-[#141204] hover:border-[#F5BF29]"
            }`}
          >
            <img
              src={character.avatar || "/placeholder.svg"}
              alt={character.name}
              className="w-full h-full object-cover"
            />
            {/* Status indicator */}
            <div
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-black ${
                character.status === "active"
                  ? "bg-green-500"
                  : character.status === "mission"
                    ? "bg-yellow-500"
                    : character.status === "injured"
                      ? "bg-red-500"
                      : "bg-gray-500"
              }`}
            />
          </button>
        ))}
      </div>

      {/* Tabbed Panel */}
      {/* <div className="bg-[#1a1a2e] rounded-lg border border-[#E71D36] overflow-hidden">
        {/* Tab Headers */}
      {/* <div className="flex border-b border-[#E71D36]">
          <button
            onClick={() => setActiveTab("computer")}
            className={`flex-1 py-2 px-4 text-sm font-roboto transition-colors ${
              activeTab === "computer" ? "bg-[#E71D36] text-white" : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
              </svg>
              Computer
            </span>
          </button>
          <button
            onClick={() => setActiveTab("phone")}
            className={`flex-1 py-2 px-4 text-sm font-roboto transition-colors ${
              activeTab === "phone" ? "bg-[#E71D36] text-white" : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2H4c-1.1 0-2 .9-2 2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
              </svg>
              Phone
            </span>
          </button>
          <button
            onClick={() => setActiveTab("map")}
            className={`flex-1 py-2 px-4 text-sm font-roboto transition-colors ${
              activeTab === "map" ? "bg-[#E71D36] text-white" : "bg-[#2a2a3e] text-gray-300 hover:bg-[#3a3a4e]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
              </svg>
              Map
            </span>
          </button>
        </div>

        {/* Tab Content */}
      {/* <div className="p-2 min-h-[300px]">
          {activeTab === "computer" && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
                </svg>
                <p className="font-roboto text-sm">Laptop Mode</p>
                <p className="font-roboto text-xs opacity-70">Access files and databases</p>
              </div>
            </div>
          )}

          {activeTab === "phone" && <PhoneUI />}

          {activeTab === "map" && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" />
                </svg>
                <p className="font-roboto text-sm">World Map View</p>
                <p className="font-roboto text-xs opacity-70">Currently viewing</p>
              </div>
            </div>
          )}
        </div>
      </div> */}
    </div>
  )
}
