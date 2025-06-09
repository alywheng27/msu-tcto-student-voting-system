import Link from "next/link"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#1E90FF] to-[#0066CC] flex items-center justify-center text-white font-bold text-xl shadow-lg">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MSU-TCTO Voting System</h1>
              <p className="text-sm text-gray-600">Student Election Portal</p>
            </div>
          </div>
          <Link href="/login">
            <Button className="bg-[#1E90FF] hover:bg-blue-600 flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
        </div>
    </header>
  )
}
