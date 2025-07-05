"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CandidatePhotoUpload } from "@/components/admin/candidates/Candidate-Photo-Upload"
import { Save, Trash2, User, AlertTriangle, X, Camera, FileText, Users, Shield, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

export function CandidateManagementModal({
  isOpen,
  onClose,
  mode,
  candidate,
  onSuccess,
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [validationMessage, setValidationMessage] = useState({ type: '', message: '' })
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    surname: "",
    extensionName: "",
    position: "",
    party: "",
    college: "",
    photo: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  })
  const [showPassword, setShowPassword] = useState(false)

  const [parties, setParties] = useState([])
  const [positions, setPositions] = useState([])
  const [colleges, setColleges] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState("")

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true)
      setDataError("")
      try {
        const [partiesRes, positionsRes, collegesRes] = await Promise.all([
          fetch("/api/admin/parties"),
          fetch("/api/admin/positions"),
          fetch("/api/login/college"),
        ])
        if (!partiesRes.ok) throw new Error("Failed to fetch parties")
        if (!positionsRes.ok) throw new Error("Failed to fetch positions")
        if (!collegesRes.ok) throw new Error("Failed to fetch colleges")
        const partiesData = await partiesRes.json()
        const positionsData = await positionsRes.json()
        const collegesData = await collegesRes.json()
        setParties(partiesData)
        setPositions(positionsData)
        setColleges(collegesData)
      } catch (err) {
        setDataError(err.message || "Failed to fetch data.")
      } finally {
        setDataLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (mode === "edit" && candidate) {
      setFormData({
        firstName: candidate.FirstName || "",
        middleName: candidate.MiddleName || "",
        surname: candidate.Surname || "",
        extensionName: candidate.ExtensionName || "",
        position: candidate.PositionID || "",
        party: candidate.PartyID || "",
        college: candidate.CollegeOfficeID || "",
        photo: candidate.Photo || "",
        username: candidate.Username || "",
        password: "",
        confirmPassword: "",
        role: candidate.UserType?.toLowerCase() || "candidate",
      })
    } else if (mode === "add") {
      setFormData({
        firstName: "",
        middleName: "",
        surname: "",
        extensionName: "",
        position: "",
        party: "",
        college: "",
        photo: "",
        username: "",
        password: "",
        confirmPassword: "",
        role: "candidate",
      })
    }
    setErrors({})
    setValidationMessage({ type: '', message: '' })
  }, [mode, candidate, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Surname is required"
    }

    if (!formData.position) {
      newErrors.position = "Position is required"
    }

    if (!formData.college) {
      newErrors.college = "College is required"
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
      if (mode === "add") {
        const response = await fetch('/api/admin/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.firstName,
            middleName: formData.middleName,
            surname: formData.surname,
            extensionName: formData.extensionName,
            username: formData.username.toLowerCase(),
            password: formData.password,
            role: formData.role,
            photo: formData.photo,
            positionID: formData.position,
            partyID: formData.party,
            collegeOfficeID: formData.college,
          })
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to add candidate')
        }
        toast({
          title: "Success",
          description: `${formData.firstName} ${formData.surname} has been added as a candidate.`,
          variant: "success",
        })
        onSuccess?.({ ...formData, action: 'add' })
      } else if (mode === "edit") {
        const updateBody = {
          userID: candidate.UserID,
          firstName: formData.firstName,
          middleName: formData.middleName,
          surname: formData.surname,
          extensionName: formData.extensionName,
          username: formData.username.toLowerCase(),
          role: formData.role,
          photo: formData.photo,
          positionID: formData.position,
          partyID: formData.party,
          collegeOfficeID: formData.college,
        };
        if (formData.password) {
          updateBody.password = formData.password;
        }
        const response = await fetch(`/api/admin/candidates/${candidate.CandidateID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateBody)
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update candidate')
        }
        toast({
          title: "Success",
          description: `${formData.firstName} ${formData.surname}'s candidate profile has been updated.`,
          variant: "success",
        })
        onSuccess?.({ ...formData, action: 'edit' })
      }
      onClose()
    } catch (error) {
      console.error("Error saving candidate:", error)
      toast({
        title: "Error",
        description: `Failed to ${mode} candidate. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/candidates/${candidate.CandidateID}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userID: candidate.UserID })
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to delete candidate')
      }
      toast({
        title: "Success",
        description: `${candidate.FirstName} ${candidate.Surname} has been deleted as a candidate.`,
        variant: "success",
      })
      onSuccess?.({ ...candidate, action: 'delete' })
      onClose()
    } catch (error) {
      console.error("Error deleting candidate:", error)
      toast({
        title: "Error",
        description: 'Failed to delete candidate. Please try again.',
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCollege = colleges.find((c) => c.CollegeOfficeID === formData.college)

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Candidate"
      case "edit":
        return "Edit Candidate"
      case "delete":
        return "Delete Candidate"
      default:
        return "Manage Candidate"
    }
  }

  const getModalDescription = () => {
    switch (mode) {
      case "add":
        return "Create a new candidate profile for the election"
      case "edit":
        return "Update the candidate information"
      case "delete":
        return "Are you sure you want to delete this candidate?"
      default:
        return ""
    }
  }

  if (dataLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex flex-col items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium">Loading data...</p>
        </DialogContent>
      </Dialog>
    )
  }
  if (dataError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-lg font-medium text-red-600">{dataError}</p>
        </DialogContent>
      </Dialog>
    )
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

            {candidate && (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={candidate.Photo || "/candidates/no-photo.png"}
                    alt={candidate.Surname}
                    className="w-full h-full object-cover"
                    width={250}
                    height={250}
                  />
                </div>
                <div>
                  <h4 className="font-medium">{candidate.FirstName} {candidate.Surname}</h4>
                  <p className="text-sm text-gray-600">{candidate.Position}</p>
                </div>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> This action cannot be undone. All votes for this candidate will also be
                affected.
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
                    Delete Candidate
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
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {getModalTitle()}
            </div>
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{getModalDescription()}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <Label className="text-sm font-medium">Candidate Photo</Label>
                </div>
                <CandidatePhotoUpload value={formData.photo} onChange={(photo) => handleInputChange("photo", photo)} />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-medium">Basic Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter candidate's first name"
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
                      placeholder="Enter candidate's middle name"
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
                      placeholder="Enter candidate's surname"
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
                      placeholder="Enter candidate's extension name"
                      value={formData.extensionName}
                      onChange={(e) => handleInputChange("extensionName", e.target.value)}
                      className={errors.extensionName ? "border-red-500" : ""}
                    />
                    {errors.extensionName && <p className="text-sm text-red-500">{errors.extensionName}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                      <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.PositionID} value={position.PositionID}>
                            {position.Position} ({position.PositionType?.toUpperCase()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.position && <p className="text-sm text-red-500">{errors.position}</p>}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="party">Party *</Label>
                    <Select value={formData.party} onValueChange={(value) => handleInputChange("party", value)}>
                      <SelectTrigger className={errors.party ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select party" />
                      </SelectTrigger>
                      <SelectContent>
                        {parties.map((party) => (
                          <SelectItem key={party.PartyID} value={party.PartyID}>
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: party.PartyColor }} />
                              {party.Party}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.party && <p className="text-sm text-red-500">{errors.party}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="college">College *</Label>
                    <Select value={formData.college} onValueChange={(value) => handleInputChange("college", value)}>
                      <SelectTrigger className={errors.college ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select college" />
                      </SelectTrigger>
                      <SelectContent>
                        {colleges.map((college) => (
                          <SelectItem key={college.CollegeOfficeID} value={college.CollegeOfficeID}>
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: college.CollegeOfficeColor }} />
                              {college.CollegeOfficeCode}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.college && <p className="text-sm text-red-500">{errors.college}</p>}
                  </div>
                </div>
              </div>

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
                      <SelectItem value="candidate">Candidate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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

          {formData.firstName && formData.surname && formData.username && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h3 className="font-medium">Preview</h3>
              </div>
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                {formData.photo ? (
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                    <Image
                      src={formData.photo}
                      alt={formData.firstName + ' ' + formData.surname}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{formData.firstName} {formData.surname}</h4>
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
                      {formData.role === "admin" ? "Administrator" : "Candidate"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {validationMessage.message && (
            <div className={`p-3 rounded-lg ${
              validationMessage.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              <p className="text-sm">{validationMessage.message}</p>
            </div>
          )}

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
                  {mode === "add" ? "Add Candidate" : "Update Candidate"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
