import Footer from '@/components/Footer'
import { VoterSidebar } from '@/components/voter/Voter-Sidebar'

export default function VoterSSCLayout({ children }) {

  return (
    <div className="flex min-h-screen bg-gray-50">
      <VoterSidebar />
      <main className="flex-1 w-full">
        <div className="p-4 md:p-6 max-w-full pt-16 md:pt-6">{children}</div>
        <Footer />
      </main>
    </div>
  )
}
