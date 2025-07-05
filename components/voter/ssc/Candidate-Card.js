"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

export function CandidateCard({ candidate, party, isSelected, onSelect, selectionMode, disabled = false }) {
  return (
    <Card
      className={`
        cursor-pointer transition-all duration-300 overflow-hidden relative group
        ${isSelected ? "ring-2 ring-[#1E90FF] shadow-xl scale-[1.02]" : "hover:shadow-lg hover:scale-[1.01]"}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        bg-white
      `}
      onClick={() => !disabled && onSelect()}
    >
      <div className="relative min-h-[140px] sm:min-h-[160px]">
        {party && (
          <>
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                background: `linear-gradient(135deg, ${party.color}20, ${party.color}05)`,
              }}
            />

            <div
              className="absolute inset-0 opacity-[0.1] bg-center bg-no-repeat transition-all duration-500 group-hover:opacity-[0.3] group-hover:scale-105"
              style={{
                backgroundImage: `url(${party.logo || "/parties/no-logo.png"})`,
                backgroundSize: "120px 120px",
                backgroundPosition: "center right 10px",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/40" />
          </>
        )}

        <div className="relative p-4 sm:p-5 flex items-center gap-3 sm:gap-4 h-full">
          <div className="flex-shrink-0 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-gray-100 border-3 border-white shadow-lg ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-4 group-hover:ring-gray-200">
              <Image
                src={candidate.photo || "/candidates/no-photo.png"}
                alt={`${candidate.name}, candidate for ${candidate.position}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  e.target.src = "/candidates/no-photo.png"
                }}
                width={120}
                height={120}
              />
            </div>

            {isSelected && (
              <div className="absolute -top-1 -right-1 bg-[#1E90FF] text-white rounded-full p-1.5 shadow-lg animate-pulse ring-2 ring-white">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="font-bold text-base sm:text-lg md:text-xl leading-tight line-clamp-2 text-gray-900 group-hover:text-gray-800 transition-colors">
              {candidate.name}
            </h3>

            {party && (
              <div className="flex items-center gap-2">
                <Badge
                  style={{ backgroundColor: party.color }}
                  className="text-white font-medium shadow-sm text-xs sm:text-sm px-2 py-1 transition-all duration-300 group-hover:shadow-md"
                >
                  <div className="w-2 h-2 rounded-full bg-white/30 mr-1.5 hidden sm:block" />
                  {party.name}
                </Badge>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm text-gray-600 font-medium">
                {selectionMode === "single" ? "Tap to select" : isSelected ? "Selected" : "Tap to select"}
              </p>

              {candidate.votes !== undefined && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {candidate.votes} votes
                </span>
              )}
            </div>
          </div>
        </div>

        {isSelected && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
              ✓ Selected
            </Badge>
          </div>
        )}

        {disabled && (
          <div className="absolute inset-0 bg-gray-500/20 flex items-center justify-center rounded-lg">
            <Badge variant="outline" className="bg-white/90 text-gray-600">
              Limit Reached
            </Badge>
          </div>
        )}
      </div>
    </Card>
  )
}
