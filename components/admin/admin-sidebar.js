"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Flag,
  Home,
  Settings,
  User,
  Users,
  Briefcase,
  BarChart,
  Calendar,
  Shield,
  Menu,
  X,
  FlaskConical,
  Palette,
  Info,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const router = useRouter()

  const isActive = (path) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const menuItems = [
    { href: "/admin/dashboard", icon: Home, label: "Dashboard" },
    { href: "/admin/candidates", icon: User, label: "Candidates" },
    { href: "/admin/parties", icon: Flag, label: "Parties" },
    { href: "/admin/positions", icon: Briefcase, label: "Positions" },
    { href: "/admin/voters", icon: Users, label: "Voters" },
    { href: "/admin/results", icon: BarChart3, label: "Results" },
    { href: "/admin/statistics", icon: BarChart, label: "Statistics" },
    // { href: "/admin/calendar", icon: Calendar, label: "Calendar" },
    // { href: "/admin/simulation", icon: FlaskConical, label: "Simulation" },
    // { href: "/admin/audit-logs", icon: Shield, label: "Audit Logs" },
    // { href: "/admin/appearance", icon: Palette, label: "Appearance" },
    // { href: "/admin/system-info", icon: Info, label: "System Info" },
    // { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  const handleLogout = async () => {
      const res = await fetch("/api/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
  
      if(res.status == 200 || res.ok) {
        router.replace("/")
      }
  }


  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("mobile-admin-sidebar")
      const toggleButton = document.getElementById("mobile-sidebar-toggle")

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
      document.body.style.overflow = "hidden" // Prevent background scroll
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

  return (
    <>
      <Button
        id="mobile-sidebar-toggle"
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-white shadow-md border border-gray-200 hover:bg-gray-50"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isMobileMenuOpen}
        aria-controls="mobile-admin-sidebar"
      >
        {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-700" /> : <Menu className="h-5 w-5 text-gray-700" />}
      </Button>

      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-[#61063B] md:border-r md:border-gray-200 md:shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* <Image
              src="/MSU-TCTO.png"
              alt="MSU-TCTO Logo"
              width={32}
              height={32}
              className="w-10 object-cover"
            /> */}
            <div className="font-semibold text-lg text-white dark:text-gray-100">MSU-TCTO</div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-white uppercase tracking-wider">Main Navigation</h3>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-gray-100 hover:text-[#61063B]",
                    isActive(item.href) ? "bg-white text-[#61063B]" : "text-white",
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

      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access the admin panel.
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

      <aside
        id="mobile-admin-sidebar"
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-80 bg-[#61063B] border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {/* <Image
              src="/MSU-TCTO.png"
              alt="MSU-TCTO Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            /> */}
            <div className="font-semibold text-lg text-white dark:text-gray-100">MSU-TCTO</div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="text-white hover:bg-gray-100 hover:text-[#61063B] dark:hover:bg-gray-800"
            >
              <X className="h-5 w-5 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-white uppercase tracking-wider">Main Navigation</h3>
            </div>

            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                    "hover:bg-gray-100 hover:text-[#61063B] touch-manipulation",
                    isActive(item.href) ? "bg-white text-[text-white]" : "text-white",
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
    </>
  )
}
