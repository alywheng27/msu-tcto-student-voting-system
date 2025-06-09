import Image from "next/image";
import Link from "next/link"
import { Users, Vote, TrendingUp, LogIn } from "lucide-react"

// Shadcn Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


// lib
import { getElectionInfo } from "@/lib/system-settings"


import Header from "@/components/Header";
import Footer from "@/components/Footer";
// import { PublicStats } from "@/components/public-stats"

export default function Home() {
  const electionInfo = getElectionInfo();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#1E90FF] to-[#0066CC] bg-clip-text text-transparent">
            {electionInfo.title}
          </h2>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">{electionInfo.description}</p>
          {electionInfo.systemMessage && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-center font-medium">{electionInfo.systemMessage}</p>
            </div>
          )}
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/login">
              <Button size="lg" className="bg-[#1E90FF] hover:bg-blue-600 shadow-lg">
                Get Started
              </Button>
            </Link>
            <Link href="#statistics">
              <Button size="lg" variant="outline" className="border-[#1E90FF] text-[#1E90FF] hover:bg-blue-50">
                View Statistics
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Vote className="w-4 h-4 text-blue-600" />
                </div>
                Supreme Student Council
              </CardTitle>
              <CardDescription>Vote for your SSC representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                All students can vote for the SSC positions including President, Vice President, and Senators.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-[#1E90FF] hover:bg-blue-600">Login to Vote</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-600" />
                </div>
                College Officers
              </CardTitle>
              <CardDescription>Vote for your college representatives</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Vote for your college-specific officers including Governor, Vice Governor, Mayor, Vice Mayor, and Board
                Members.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">Login to Vote</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                Election Results
              </CardTitle>
              <CardDescription>View the current election results</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Results will be available after the voting period has ended. Check back later to see who won!
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                  Login to View
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
