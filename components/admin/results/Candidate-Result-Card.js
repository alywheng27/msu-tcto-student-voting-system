"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award } from "lucide-react"
import Image from "next/image"

export function CandidateResultCard({ candidate, party, rank, isWinner, isDraw, votes, totalVotes }) {
  const votePercentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0

  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
    return <span className="text-lg sm:text-xl font-bold text-gray-500">#{rank}</span>
  }

  const getRankBadgeColor = () => {
    if (rank === 1) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (rank === 2) return "bg-gray-100 text-gray-800 border-gray-200"
    if (rank === 3) return "bg-amber-100 text-amber-800 border-amber-200"
    return "bg-gray-50 text-gray-600 border-gray-200"
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
        isDraw
          ? "ring-2 ring-orange-500 bg-gradient-to-r from-orange-50 to-white shadow-lg"
          : isWinner
          ? "ring-2 ring-green-500 bg-gradient-to-r from-green-50 to-white shadow-lg"
          : "hover:shadow-md"
      }`}
    >
      <CardContent className="p-0">
        <div className="relative min-h-[100px] sm:min-h-[120px]">
          {party && (
            <>
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  background: `linear-gradient(135deg, ${party.PartyColor}25, ${party.PartyColor}08)`,
                }}
              />

              <div
                className="absolute inset-0 opacity-[0.5] bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${party.Logo || "/parties/no-logo.png"})`,
                  backgroundSize: "100px 100px",
                  backgroundPosition: "center right 15px",
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/50" />
            </>
          )}

          {isWinner && !isDraw && <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-transparent" />}
          {isDraw && <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-transparent" />}

          <div className="relative p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <div className="flex-shrink-0 flex flex-col items-center justify-center">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 mb-1">{getRankIcon()}</div>
              <Badge className={`text-xs px-2 py-0.5 ${getRankBadgeColor()}`}>#{rank}</Badge>
            </div>

            <div className="flex-shrink-0 relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md ring-2 ring-gray-100">
                <Image
                  src={candidate.photo || "/candidates/no-photo.png"}
                  alt={`${candidate.firstName} ${candidate.surname}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/candidates/no-photo.png"
                  }}
                  width={160}
                  height={160}
                />
              </div>

              {isWinner && !isDraw && rank === 1 && (
                <div className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow-sm">
                  <Trophy className="h-3 w-3" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 space-y-1 sm:space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-2 text-gray-900">
                  {candidate.firstName} {candidate.surname}
                </h4>

                <div className="flex-shrink-0">
                  {isDraw ? (
                    <Badge className="bg-orange-500 text-white text-xs sm:text-sm font-medium shadow-sm">
                      Draw
                    </Badge>
                  ) : isWinner ? (
                    <Badge className="bg-green-500 text-white text-xs sm:text-sm font-medium shadow-sm">
                      ✓ Elected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600 text-xs sm:text-sm border-gray-300">
                      Not Elected
                    </Badge>
                  )}
                </div>
              </div>

              {party && (
                <div className="flex items-center gap-2">
                  <Badge
                    style={{ backgroundColor: party.PartyColor }}
                    className="text-white text-xs sm:text-sm font-medium shadow-sm px-2 py-1"
                  >
                    <div className="w-2 h-2 rounded-full bg-white/30 mr-1.5 hidden sm:block" />
                    {party.Party}
                  </Badge>
                </div>
              )}

              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900">{votes.toLocaleString()}</span>
                  <span className="text-gray-600">votes</span>
                </div>
                <div className="text-gray-400">•</div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold" style={{ color: party?.PartyColor || "#6B7280" }}>
                    {votePercentage}%
                  </span>
                  <span className="text-gray-600">share</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 sm:px-4 pb-3 sm:pb-4">
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                style={{
                  width: `${Math.max(votePercentage, 2)}%`, // Minimum 2% for visibility
                  backgroundColor: party?.PartyColor || "#6B7280",
                }}
              >
                {isWinner && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                )}
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span className="font-medium" style={{ color: party?.PartyColor || "#6B7280" }}>
                {votePercentage}%
              </span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
