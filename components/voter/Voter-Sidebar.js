"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Vote, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LogOut } from "lucide-react"
import Cookies from "js-cookie"
import Image from "next/image"

export function VoterSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const [cookieValue, setCookieValue] = useState({})

  function fetchCookies() {
    return {
      hasVotedSSC: Cookies.get("HasVotedSSC"),
      hasVotedCollege: Cookies.get("HasVotedCollege")
    }
  }

  const isActive = (path) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  let menuItems = [
    { href: "/voter/dashboard", icon: Home, label: "Dashboard" },
  ]
  console.log(cookieValue.hasVotedSSC)
  if (cookieValue.hasVotedSSC == "false") {
    menuItems.push({ href: "/voter/vote/ssc", icon: Vote, label: "SSC Voting" })
  }

  if (cookieValue.hasVotedCollege == "false") {
    menuItems.push({ href: "/voter/vote/college", icon: Vote, label: "College Voting" })
  }
  


  useEffect(() => {
    setIsMobileMenuOpen(false)
    setCookieValue(fetchCookies())
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-voter-sidebar")
      const toggleButton = document.getElementById("mobile-voter-sidebar-toggle")

      if (
        isMobileMenuOpen &&
        sidebar &&
        toggleButton &&
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        setIsMobileMenuOpen(false)
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isMobileMenuOpen])

  const handleLogout = async () => {
    const res = await fetch("/api/logout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    if (res.status === 200 || res.ok) {
      router.replace("/")
    }
  }

  return (
    <>
      <Button
        id="mobile-voter-sidebar-toggle"
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md border border-gray-200 hover:bg-gray-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-voter-sidebar"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
      </Button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-gray-200 md:shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Image
              src="/MSU-TCTO.png"
              alt="MSU-TCTO Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">MSU-TCTO</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Voting Portal</h3>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-gray-100 hover:text-gray-900",
                    isActive(item.href) ? "bg-[#1E90FF] text-white hover:bg-[#1E90FF]/90" : "text-gray-700",
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => setShowLogoutConfirmation(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <aside
        id="mobile-voter-sidebar"
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Image
              src="/MSU-TCTO.png"
              alt="MSU-TCTO Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">MSU-TCTO</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Voting Portal</h3>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-gray-100 hover:text-gray-900 touch-manipulation",
                    isActive(item.href) ? "bg-[#1E90FF] text-white hover:bg-[#1E90FF]/90" : "text-gray-700",
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="border-t border-gray-200 p-4 space-y-2">
          <button
            onClick={() => {
              setShowLogoutConfirmation(true)
              setIsMobileMenuOpen(false)
            }}
            className="w-full flex items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200 touch-manipulation"
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access the voting portal.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
