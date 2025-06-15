import { AdminSidebar } from "@/components/admin/admin-sidebar"
import Footer from "@/components/Footer"
// import { SimulationModeIndicator } from "@/components/simulation-mode-indicator"

export default function AdminLayout({ children, turnout, colleges, parties }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {/* <SimulationModeIndicator variant="alert" showDetails className="mb-6" /> */}
          {children}
          
        </div>
        <Footer />
      </main>
    </div>
  )
}
