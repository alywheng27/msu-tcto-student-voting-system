"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { CheckCircle2, Home, ArrowLeft, Sparkles, Receipt, Shield, Calculator } from "lucide-react"
import confetti from "canvas-confetti"
import { VoteReceiptModal } from "@/components/voter/success/Vote-Receipt-Modal"
import { generateVoteReceipt, registerReceipt, VoteReceipt, VoteSelection } from "@/lib/receipt-system"

export default function VoteSuccessPage() {
  const searchParams = useSearchParams()
  const type = searchParams.get("type") || "election"
  const [showConfetti, setShowConfetti] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState(false)

  // Format the type for display
  const formattedType =
    type === "ssc" ? "Supreme Student Council" : type === "college" ? "College Officers" : "Election"

  // Trigger confetti effect on page load
  useEffect(() => {
    // Small delay to ensure the component is mounted
    const timer = setTimeout(() => {
      setShowConfetti(true)

      // Launch confetti
      const duration = 3 * 1000
      const animationEnd = Date.now() + duration
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

      function randomInRange(min, max) {
        return Math.random() * (max - min) + min
      }

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now()

        if (timeLeft <= 0) {
          return clearInterval(interval)
        }

        const particleCount = 50 * (timeLeft / duration)

        // Launch confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      }, 250)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const generateReceipt = async () => {
    setIsGeneratingReceipt(true)
    try {
      // Mock vote selections - in a real app, this would come from the voting process
      const mockSelections = [
        {
          positionId: "president",
          positionName: "President",
          candidateId: "1",
          candidateName: "Ahmad Khan",
          partyName: "Unity Party",
        },
        {
          positionId: "vice-president",
          positionName: "Vice President",
          candidateId: "4",
          candidateName: "Fatima Hassan",
          partyName: "Unity Party",
        },
        {
          positionId: "secretary",
          positionName: "Secretary",
          candidateId: "7",
          candidateName: "Maria Santos",
          partyName: "Progress Alliance",
        },
      ]

      const generatedReceipt = await generateVoteReceipt(mockSelections, type, type === "college" ? "cas" : undefined)

      // Register the receipt for verification
      await registerReceipt(generatedReceipt.receiptId, generatedReceipt.voteChecksum, generatedReceipt.sequenceNumber)

      setReceipt(generatedReceipt)
      setShowReceiptModal(true)
    } catch (error) {
      console.error("Failed to generate receipt:", error)
    } finally {
      setIsGeneratingReceipt(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md mx-auto">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100"
        >
          <div className="p-6 bg-green-50 flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.3,
              }}
              className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
          </div>

          <div className="p-6 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-gray-800 mb-2">Vote Submitted Successfully!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for participating in the {formattedType} election. Your vote has been recorded.
              </p>

              <div className="flex flex-col gap-3">
                <Link href="/voter/dashboard">
                  <Button className="w-full bg-green-600 hover:bg-green-700 gap-2 group">
                    <Home className="w-4 h-4 group-hover:animate-pulse" />
                    Return to Dashboard
                  </Button>
                </Link>

                {/* <Link href="/">
                  <Button variant="outline" className="w-full gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link> */}

                {/* <Button
                  onClick={generateReceipt}
                  disabled={isGeneratingReceipt}
                  variant="outline"
                  className="w-full gap-2 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Receipt className="w-4 h-4" />
                  {isGeneratingReceipt ? "Generating..." : "Generate Receipt"}
                </Button> */}

                {/* <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                  <Calculator className="w-3 h-3" />
                  <span>Receipt uses mathematical validation (no hashing)</span>
                </div> */}

                {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Shield className="w-3 h-3" />
                  <span>Completely untraceable and maintains anonymity</span>
                </div> */}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Floating sparkles animation */}
        {showConfetti && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute top-1/4 left-1/4"
            >
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 1 }}
              className="absolute bottom-1/3 right-1/4"
            >
              <Sparkles className="w-5 h-5 text-blue-400 animate-bounce" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="absolute top-1/3 right-1/3"
            >
              <Sparkles className="w-7 h-7 text-purple-400 animate-ping" />
            </motion.div>
          </>
        )}

        <VoteReceiptModal isOpen={showReceiptModal} onClose={() => setShowReceiptModal(false)} receipt={receipt} />
      </div>
    </div>
  )
}
