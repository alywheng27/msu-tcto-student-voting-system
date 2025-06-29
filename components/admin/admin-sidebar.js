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
// import { ThemeToggle } from "@/components/theme-toggle"

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
    { href: "/admin/calendar", icon: Calendar, label: "Calendar" },
    { href: "/admin/simulation", icon: FlaskConical, label: "Simulation" },
    { href: "/admin/audit-logs", icon: Shield, label: "Audit Logs" },
    { href: "/admin/appearance", icon: Palette, label: "Appearance" },
    { href: "/admin/system-info", icon: Info, label: "System Info" },
    { href: "/admin/settings", icon: Settings, label: "Settings" },
  ]

  const handleLogout = async () => {
    // TODO: Implement logout functionality
    // console.log("Logout confirmed")
    // setShowLogoutConfirmation(false)

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


  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Close mobile menu when clicking outside
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

  // Handle escape key
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
      {/* Mobile Toggle Button */}
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

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar - Always visible on desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:bg-white md:border-r md:border-gray-200 md:shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#1E90FF] flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">MSU-TCTO</div>
          </div>
          {/* <ThemeToggle variant="ghost" size="sm" /> */}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Main Navigation</h3>
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

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <Home className="h-4 w-4 flex-shrink-0" />
            <span>Back to Home</span>
          </Link> */}
          <button
            onClick={() => setShowLogoutConfirmation(true)}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <Dialog open={showLogoutConfirmation} onOpenChange={setShowLogoutConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access the admin panel.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:gap-0">
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

      {/* Mobile Sidebar - Toggle behavior */}
      <aside
        id="mobile-admin-sidebar"
        className={cn(
          "md:hidden fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
        aria-hidden={!isMobileMenuOpen}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-[#1E90FF] flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div className="font-semibold text-lg text-gray-900 dark:text-gray-100">MSU-TCTO</div>
          </div>
          <div className="flex items-center gap-2">
            {/* <ThemeToggle variant="ghost" size="sm" /> */}
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

        {/* Mobile Navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Main Navigation</h3>
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

        {/* Mobile Footer */}
        <div className="border-t border-gray-200 p-4 space-y-2">
          {/* <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 touch-manipulation"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Home className="h-5 w-5 flex-shrink-0" />
            <span>Back to Home</span>
          </Link> */}
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
