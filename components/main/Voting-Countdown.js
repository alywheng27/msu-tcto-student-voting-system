"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, AlertTriangle, CheckCircle } from "lucide-react"

export function VotingCountdown({ electionEndDate, electionName, electionStatus }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const endTime = new Date(electionEndDate).getTime()
      const difference = endTime - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          total: difference,
        })
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [electionEndDate])

  const getStatusColor = () => {
    if (electionStatus === "ended" || timeLeft.total <= 0) return "bg-gray-500"
    if (timeLeft.days === 0 && timeLeft.hours < 24) return "bg-red-500"
    if (timeLeft.days < 3) return "bg-orange-500"
    return "bg-green-500"
  }

  const getStatusText = () => {
    if (electionStatus === "ended" || timeLeft.total <= 0) return "Voting Ended"
    if (electionStatus === "upcoming") return "Voting Starts Soon"
    return "Voting Active"
  }

  const getUrgencyLevel = () => {
    if (timeLeft.total <= 0) return "ended"
    if (timeLeft.days === 0 && timeLeft.hours < 1) return "critical"
    if (timeLeft.days === 0 && timeLeft.hours < 24) return "urgent"
    if (timeLeft.days < 3) return "warning"
    return "normal"
  }

  const urgencyLevel = getUrgencyLevel()

  return (
    <Card
      className={`relative overflow-hidden border-2 ${
        urgencyLevel === "critical"
          ? "border-red-500 animate-pulse"
          : urgencyLevel === "urgent"
            ? "border-red-400"
            : urgencyLevel === "warning"
              ? "border-orange-400"
              : urgencyLevel === "ended"
                ? "border-gray-400"
                : "border-green-400"
      }`}
    >
      {urgencyLevel === "critical" && (
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 animate-pulse"></div>
      )}

      <CardHeader className="relative md:pb-3 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock
              className={`w-5 h-5 ${
                urgencyLevel === "critical"
                  ? "text-red-600 animate-spin"
                  : urgencyLevel === "urgent"
                    ? "text-red-500"
                    : urgencyLevel === "warning"
                      ? "text-orange-500"
                      : urgencyLevel === "ended"
                        ? "text-gray-500"
                        : "text-green-500"
              }`}
            />
            <CardTitle className="text-lg font-bold">Voting Countdown</CardTitle>
          </div>
          <Badge className={`${getStatusColor()} text-white font-medium px-3 py-1`}>{getStatusText()}</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-1">{electionName}</p>
      </CardHeader>

      <CardContent className="relative">
        {timeLeft.total > 0 ? (
          <>
            <div className="grid grid-cols-4 md:gap-4 gap-0 md:mb-13 mb-5 md:mt-5 mt-0">
              <div className="text-center">
                <div
                  className={`lg:text-7xl md:text-5xl text-3xl font-bold ${
                    urgencyLevel === "critical"
                      ? "text-red-600"
                      : urgencyLevel === "urgent"
                        ? "text-red-500"
                        : urgencyLevel === "warning"
                          ? "text-orange-500"
                          : "text-green-600"
                  }`}
                >
                  {timeLeft.days.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-lg text-gray-500 font-medium">DAYS</div>
              </div>
              <div className="text-center">
                <div
                  className={`lg:text-7xl md:text-5xl text-3xl font-bold ${
                    urgencyLevel === "critical"
                      ? "text-red-600"
                      : urgencyLevel === "urgent"
                        ? "text-red-500"
                        : urgencyLevel === "warning"
                          ? "text-orange-500"
                          : "text-green-600"
                  }`}
                >
                  {timeLeft.hours.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-lg text-gray-500 font-medium">HOURS</div>
              </div>
              <div className="text-center">
                <div
                  className={`lg:text-7xl md:text-5xl text-3xl font-bold ${
                    urgencyLevel === "critical"
                      ? "text-red-600"
                      : urgencyLevel === "urgent"
                        ? "text-red-500"
                        : urgencyLevel === "warning"
                          ? "text-orange-500"
                          : "text-green-600"
                  }`}
                >
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-lg text-gray-500 font-medium">MINUTES</div>
              </div>
              <div className="text-center">
                <div
                  className={`lg:text-7xl md:text-5xl text-3xl font-bold ${
                    urgencyLevel === "critical"
                      ? "text-red-600 animate-pulse"
                      : urgencyLevel === "urgent"
                        ? "text-red-500"
                        : urgencyLevel === "warning"
                          ? "text-orange-500"
                          : "text-green-600"
                  }`}
                >
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm md:text-lg text-gray-500 font-medium">SECONDS</div>
              </div>
            </div>

            {urgencyLevel === "critical" && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-red-600 animate-bounce" />
                <span className="text-sm font-medium text-red-700">⚠️ Less than 1 hour remaining! Vote now!</span>
              </div>
            )}

            {urgencyLevel === "urgent" && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">
                  🕐 Less than 24 hours remaining! Don&apos;t miss your chance to vote!
                </span>
              </div>
            )}

            {urgencyLevel === "warning" && (
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-700">
                  📅 Less than 3 days remaining! Make sure to cast your vote soon.
                </span>
              </div>
            )}

            {urgencyLevel === "normal" && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  ✅ Voting is active! You have plenty of time to make your choice.
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl font-bold text-gray-500 mb-2">00:00:00:00</div>
            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <CheckCircle className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600 font-medium">Voting period has ended. Thank you for participating!</span>
            </div>
          </div>
        )}

        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>
              Voting ends:{" "}
              {new Date(electionEndDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
