"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Save, Trash2, User, AlertTriangle, X, UserPlus, Shield, GraduationCap, Eye, EyeOff } from "lucide-react"

export function VoterManagementModal({ isOpen, onClose, mode, voter, onSuccess }) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    extensionName: "",
    username: "",
    password: "",
    confirmPassword: "",
    college: "",
    role: "voter",
  })
  const [colleges, setColleges] = useState([])
  const [collegesLoading, setCollegesLoading] = useState(true)

  // Initialize form data when modal opens or voter changes
  useEffect(() => {
    if (mode === "edit" && voter) {
      setFormData({
        firstName: voter.FirstName || "",
        middleName: voter.MiddleName || "",
        surname: voter.Surname || "",
        extensionName: voter.ExtensionName || "",
        username: voter.Username || "",
        password: "", // Don't pre-fill password for security
        confirmPassword: "",
        college: voter.CollegeOffice || "",
        role: voter.UserType.toLowerCase() || "voter",
      })
    } else if (mode === "add") {
      setFormData({
        firstName: "",
        middleName: "",
        surname: "",
        extensionName: "",
        username: "",
        password: "",
        confirmPassword: "",
        college: "",
        role: "voter",
      })
    }
    setErrors({})
    setShowPassword(false)
  }, [mode, voter, isOpen])

  useEffect(() => {
    const fetchColleges = async () => {
      setCollegesLoading(true)
      try {
        const response = await fetch('/api/login/college')
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        setColleges(data)
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch colleges.",
          variant: "destructive"
        })
        setColleges([])
      } finally {
        setCollegesLoading(false)
      }
    }
    fetchColleges()
  }, [toast])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
      newErrors.username = "Username can only contain letters, numbers, dots, hyphens, and underscores"
    }

    if (mode === "add" || formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    if (!formData.college) {
      newErrors.college = "College is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (mode === "delete") {
      await handleDelete()
      return
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors below and try again.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mode === "add") {
        console.log("Adding voter:", { ...formData, password: "[HIDDEN]" })
        toast({
          title: "Success",
          description: "Voter has been added successfully.",
        })
      } else if (mode === "edit") {
        const updateData = { ...formData }
        if (!updateData.password) {
          delete updateData.password
          delete updateData.confirmPassword
        }
        console.log("Updating voter:", { id: voter.id, ...updateData, password: "[HIDDEN]" })
        toast({
          title: "Success",
          description: "Voter has been updated successfully.",
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving voter:", error)
      toast({
        title: "Error",
        description: `Failed to ${mode} voter. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      console.log("Deleting voter:", voter.id)
      toast({
        title: "Success",
        description: "Voter has been deleted successfully.",
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting voter:", error)
      toast({
        title: "Error",
        description: "Failed to delete voter. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCollege = colleges.find((c) => c.CollegeOffice == voter?.CollegeOffice) || colleges.find((c) => c.CollegeOffice == formData.college) || "Unknown College"

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Voter"
      case "edit":
        return "Edit Voter"
      case "delete":
        return "Delete Voter"
      default:
        return "Manage Voter"
    }
  }

  const getModalDescription = () => {
    switch (mode) {
      case "add":
        return "Create a new voter account for the election"
      case "edit":
        return "Update the voter information and credentials"
      case "delete":
        return "Are you sure you want to delete this voter?"
      default:
        return ""
    }
  }

  if (mode === "delete") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{getModalDescription()}</p>

            {voter && (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{voter.FirstName} {voter.Surname}</h4>
                  <p className="text-sm text-gray-600">@{voter.Username}</p>
                  <p className="text-xs text-gray-500">
                    {selectedCollege.CollegeOfficeCode}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. The voter will lose access to the system and any
                voting history will be affected.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  "Deleting..."
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Voter
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              {getModalTitle()}
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{getModalDescription()}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="h-4 w-4" />
              <h3 className="font-medium">Personal Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  placeholder="Enter voter's first name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name *</Label>
                <Input
                  id="middleName"
                  placeholder="Enter voter's middle name"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange("middleName", e.target.value)}
                  className={errors.middleName ? "border-red-500" : ""}
                />
                {errors.middleName && <p className="text-sm text-red-500">{errors.middleName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Surname *</Label>
                <Input
                  id="surname"
                  placeholder="Enter voter's surname"
                  value={formData.surname}
                  onChange={(e) => handleInputChange("surname", e.target.value)}
                  className={errors.surname ? "border-red-500" : ""}
                />
                {errors.surname && <p className="text-sm text-red-500">{errors.surname}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="extensionName">Extension Name *</Label>
                <Input
                  id="extensionName"
                  placeholder="Enter voter's extension name"
                  value={formData.extensionName}
                  onChange={(e) => handleInputChange("extensionName", e.target.value)}
                  className={errors.extensionName ? "border-red-500" : ""}
                />
                {errors.extensionName && <p className="text-sm text-red-500">{errors.extensionName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College *</Label>
                <Select value={formData.college} onValueChange={(value) => handleInputChange("college", value)} disabled={collegesLoading}>
                  <SelectTrigger className={errors.college ? "border-red-500" : ""}>
                    <SelectValue placeholder={collegesLoading ? "Loading colleges..." : "Select college"} />
                  </SelectTrigger>
                  <SelectContent>
                    {colleges.map((college) => (
                      <SelectItem key={college.CollegeOfficeID} value={college.CollegeOffice}>
                        <div className="flex items-center">
                          <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: college.CollegeOfficeColor || '#ccc' }} />
                          {college.CollegeOffice} ({college.CollegeOfficeCode})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.college && <p className="text-sm text-red-500">{errors.college}</p>}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-4 w-4" />
              <h3 className="font-medium">Account Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value.toLowerCase())}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                <p className="text-xs text-gray-500">Username will be converted to lowercase</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleInputChange("role", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter">Voter</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password {mode === "add" ? "*" : "(leave blank to keep current)"}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === "add" ? "Enter password" : "Enter new password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password {mode === "add" || formData.password ? "*" : ""}
                </Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={!formData.password && mode === "edit"}
                />
                {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {formData.firstName && formData.username && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <h3 className="font-medium">Preview</h3>
              </div>
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{formData.firstName} {formData.surname}</h4>
                  <p className="text-sm text-gray-600">@{formData.username}</p>
                  {selectedCollege && (
                    <div className="mt-2">
                      <Badge variant="outline" style={{ borderColor: selectedCollege.CollegeOfficeColor || '#ccc' }}>
                        {selectedCollege.CollegeOfficeCode}
                      </Badge>
                    </div>
                  )}
                  <div className="mt-2">
                    <Badge variant={formData.role === "admin" ? "default" : "secondary"}>
                      {formData.role === "admin" ? "Administrator" : "Voter"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#1E90FF] hover:bg-blue-600">
              {isLoading ? (
                mode === "add" ? (
                  "Adding..."
                ) : (
                  "Updating..."
                )
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {mode === "add" ? "Add Voter" : "Update Voter"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
