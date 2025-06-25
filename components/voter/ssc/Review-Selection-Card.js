"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit2, X, User } from "lucide-react"

export function ReviewSelectionCard({ position, candidate, party, college, onEdit, onRemove, isSkipped = false }) {
  if (isSkipped) {
    return (
      <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
        <CardContent className="p-4">
          <div className="text-center py-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
            <h4 className="font-medium text-gray-900 mb-1">{position}</h4>
            <p className="text-sm text-muted-foreground italic mb-3">Position skipped</p>
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Select Candidate
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-green-200 bg-green-50/30 hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-0">
        <div className="relative">
          {/* Party Logo Background */}
          {party && (
            <>
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  background: `linear-gradient(135deg, ${party.color}20, ${party.color}05)`,
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.08] bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${party.logo || "/placeholder.svg?height=200&width=200"})`,
                  backgroundSize: "80px 80px",
                  backgroundPosition: "center right 10px",
                }}
              />
              {/* <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/60" /> */}
            </>
          )}

          {/* Content */}
          <div className="relative p-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">{position}</h4>
                <Badge variant="outline" style={{ borderColor: college.color, color: college.color }}>
                  {college.shortName}
                </Badge>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onRemove} className="h-8 w-8 p-0 text-red-500">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Candidate Info */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-md ring-2 ring-gray-100">
                <img
                  src={candidate?.photo || "/placeholder.svg?height=56&width=56"}
                  alt={candidate?.name || "Candidate"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=56&width=56"
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-base leading-tight line-clamp-2 text-gray-900 mb-1">{candidate?.name}</p>
                {party && (
                  <Badge style={{ backgroundColor: party.color }} className="text-white text-xs font-medium mb-2">
                    <div className="w-2 h-2 rounded-full bg-white/30 mr-1.5" />
                    {party.name}
                  </Badge>
                )}
                <p className="text-xs text-muted-foreground">Selected for {position}</p>
              </div>
            </div>

            {/* Selection Indicator */}
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs font-medium text-green-700">Selected</span>
                </div>
                <Badge className="bg-green-100 text-green-800 text-xs">✓ Confirmed</Badge>
              </div>
            </div>
          </div>

          {/* Selection Border */}
          {/* <div className="absolute inset-0 border-2 border-green-400 rounded-lg pointer-events-none opacity-50" /> */}
        </div>
      </CardContent>
    </Card>
  )
}
