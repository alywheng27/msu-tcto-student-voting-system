"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function AlreadyVotedPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="flex flex-col items-center gap-2">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-2" />
          <CardTitle className="text-center text-2xl font-bold">You already voted</CardTitle>
          <CardDescription className="text-center text-gray-500">
            Our system has detected that you have already cast your vote.<br />Thank you for participating in the election!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center mt-4">
          <Link href="/voter/dashboard" passHref>
            <Button as="a" className="w-full max-w-xs" size="lg">
              Return to Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
