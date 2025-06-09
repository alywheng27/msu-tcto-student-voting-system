"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Shield, GraduationCap } from "lucide-react"

export default function LoginPage() {
  const [collegeOptions, setCollegeOptions] = useState([])
  const [step, setStep] = useState("role")
  const [role, setRole] = useState("")
  const usernameRef = useRef(null)
  const passwordRef = useRef(null)
  const [college, setCollege] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [collegeLoading, setCollegeLoading] = useState(true)

  useEffect(() => {
    fetch("/api/login/college")
      .then(res => res.json())
      .then(setCollegeOptions)
      .finally(() => setCollegeLoading(false))
  }, [])

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole)
    setError("")
    if (selectedRole === "admin") {
      setStep("credentials")
    } else {
      setStep("college")
    }
  }

  const handleCollegeSelect = (selectedCollege) => {
    setCollege(selectedCollege)
    setError("")
    setStep("credentials")
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let username
      let password

      usernameRef && (username = usernameRef.current.value)
      passwordRef && (password = passwordRef.current.value)
      
      const form = {
        username: username,
        password: password,
        role: role,
        college: college,
      }

      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      
      if (res.status == 200) {
        let data = await res.json()
        
        // setCurrentUser(user)
        // Add Cookies
        // Add a small delay to ensure state is set
        setTimeout(() => {
          if (data[0]?.UserTypeID == 1) {
            router.push("/admin/dashboard")
          }else if(data[0]?.UserTypeID == 2) {
            router.push("/voter/dashboard")
          }
        }, 100)
      } else {
        let data = await res.json()
        setError(data.message)
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (step === "credentials") {
      if (role === "admin") {
        setStep("role")
      } else {
        setStep("college")
      }
    } else if (step === "college") {
      setStep("role")
    }
    setError("")
  }

  const handleKeyDown = (e) => {
    if(e.code === 'Enter' || e.code === 'NumpadEnter') {
      handleLogin(e)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-xl border-0">
          <CardHeader className="text-center px-6 py-8 sm:px-8 sm:py-10">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-md">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">MSU-TCTO Voting System</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {step === "role" && "Select your role to continue"}
              {step === "college" && "Select your college"}
              {step === "credentials" && "Enter your credentials"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8 sm:px-8 sm:pb-10">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === "role" && (
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-16 text-left justify-start"
                  onClick={() => handleRoleSelect("admin")}
                >
                  <Shield className="w-6 h-6 mr-3 text-blue-600" />
                  <div>
                    <div className="font-semibold">Administrator</div>
                    <div className="text-sm text-gray-500">Manage elections and view results</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-16 text-left justify-start"
                  onClick={() => handleRoleSelect("voter")}
                >
                  <User className="w-6 h-6 mr-3 text-green-600" />
                  <div>
                    <div className="font-semibold">Voter</div>
                    <div className="text-sm text-gray-500">Cast your vote in the election</div>
                  </div>
                </Button>
              </div>
            )}

            {step === "college" && (
              <div className="space-y-4">
                <Label htmlFor="college">Select Your College</Label>
                {collegeLoading ? (
                  <div>Fetching data...</div>
                ) : (
                  <Select onValueChange={handleCollegeSelect}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your college" />
                    </SelectTrigger>
                    <SelectContent>
                      {collegeOptions.map((collegeOption) => (
                        <SelectItem key={collegeOption.CollegeOfficeID} value={collegeOption.CollegeOffice}>
                          {collegeOption.CollegeOffice}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button variant="outline" onClick={handleBack} className="w-full">
                  Back
                </Button>
              </div>
            )}

            {step === "credentials" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    ref={usernameRef}
                    required
                    placeholder="Enter your username"
                    onKeyDown={(e) => handleKeyDown(e)} autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    required
                    placeholder="Enter your password"
                    onKeyDown={(e) => handleKeyDown(e)}
                  />
                </div>

                {role === "voter" && college && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-800">
                      <strong>Role:</strong> Voter
                      <br />
                      <strong>College:</strong> {college}
                    </div>
                  </div>
                )}

                {role === "admin" && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      <strong>Role:</strong> Administrator
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button type="submit" className="w-full bg-[#1E90FF] hover:bg-blue-600 shadow-lg" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleBack} className="w-full">
                    Back
                  </Button>
                </div>
              </form>
            )}

            <div className="text-center text-sm text-gray-500">
              <div className="mb-2">Demo Credentials:</div>
              <div className="space-y-1">
                <div>
                  <strong>Admin:</strong> admin / admin123
                </div>
                <div>
                  <strong>Voter:</strong> john.doe / voter123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
