"use client"

import { useState, useRef, useEffect, createContext, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap } from "lucide-react"

import Role from "@/components/login/Role"
import College from "@/components/login/College"
import Credentials from "@/components/login/Credentials"

export const LoginContext = createContext(null)

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

  const handleRoleSelect = useCallback((selectedRole) => {
    setRole(selectedRole)
    setError("")
    if (selectedRole === "admin") {
      setStep("credentials")
    } else {
      setStep("college")
    }
  }, [])

  const handleCollegeSelect = useCallback((selectedCollege) => {
    setCollege(selectedCollege)
    setError("")
    setStep("credentials")
  }, [])

  const handleLogin = useCallback(async (e) => {
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
            router.replace("/admin/dashboard")
          }else if(data[0]?.UserTypeID == 2  || data[0]?.UserTypeID == 3) {
            router.replace("/voter/dashboard")
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
  }, [college, role, router])

  const handleBack = useCallback(() => {
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
  }, [role, step])

  const handleKeyDown = useCallback((e) => {
    if(e.code === 'Enter' || e.code === 'NumpadEnter') {
      handleLogin(e)
    }
  }, [handleLogin])

  const providerValue = {
    handleRoleSelect,
    collegeLoading,
    handleCollegeSelect,
    collegeOptions,
    handleBack,
    handleLogin,
    usernameRef,
    handleKeyDown,
    passwordRef,
    role,
    college,
    isLoading
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

            <LoginContext.Provider value={providerValue}>
              {step === "role" && (
                <Role />
              )}
              {step === "college" && (
                <College />
              )}
              {step === "credentials" && (
                <Credentials />
              )}
            </LoginContext.Provider>

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
