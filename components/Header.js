import Link from "next/link"
import Image from "next/image"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-[#61063B] shadow-sm border-b text-white">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/MSU-TCTO.png"
              alt="MSU-TCTO Logo"
              width={48}
              height={48}
              className="h-12 w-15 px-1 object-contain shadow-lg bg-white"
            />
            <div>
              <h1 className="text-xl font-bold">MSU-TCTO Voting System</h1>
              <p className="text-sm">Student Election Portal</p>
            </div>
          </div>
          <Link href="/login">
            <Button className="bg-[#61063B] border border-white hover:bg-white hover:text-[#61063B] flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </Button>
          </Link>
        </div>
    </header>
  )
}
