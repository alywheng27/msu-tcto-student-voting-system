"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CandidatePhotoUpload } from "@/components/admin/candidates/Candidate-Photo-Upload"
import { Save, Trash2, User, AlertTriangle, X, Camera, FileText, Users } from "lucide-react"
import { parties, positions, colleges } from "@/lib/data2"

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
    name: "",
    position: "",
    party: "",
    college: "",
    photo: "",
    bio: "",
    platform: "",
  })

  // Initialize form data when modal opens or candidate changes
  useEffect(() => {
    if (mode === "edit" && candidate) {
      setFormData({
        name: candidate.name || "",
        position: candidate.position || "",
        party: candidate.party || "",
        college: candidate.college || "",
        photo: candidate.photo || "",
        bio: candidate.bio || "",
        platform: candidate.platform || "",
      })
    } else if (mode === "add") {
      setFormData({
        name: "",
        position: "",
        party: "",
        college: "",
        photo: "",
        bio: "",
        platform: "",
      })
    }
    setErrors({})
    setValidationMessage({ type: '', message: '' })
  }, [mode, candidate, isOpen])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.position) {
      newErrors.position = "Position is required"
    }

    if (!formData.party) {
      newErrors.party = "Party is required"
    }

    // Check if college is required for college positions
    const position = positions.find((p) => p.id === formData.position)
    if (position?.type === "college" && !formData.college) {
      newErrors.college = "College is required for college positions"
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
      setValidationMessage({
        type: 'error',
        message: 'Please fix the errors below and try again.'
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (mode === "add") {
        console.log("Adding candidate:", formData)
        setValidationMessage({
          type: 'success',
          message: 'Candidate has been added successfully.'
        })
      } else if (mode === "edit") {
        console.log("Updating candidate:", { id: candidate.id, ...formData })
        setValidationMessage({
          type: 'success',
          message: 'Candidate has been updated successfully.'
        })
      }

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error saving candidate:", error)
      setValidationMessage({
        type: 'error',
        message: `Failed to ${mode} candidate. Please try again.`
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

      console.log("Deleting candidate:", candidate.id)
      setValidationMessage({
        type: 'success',
        message: 'Candidate has been deleted successfully.'
      })

      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error deleting candidate:", error)
      setValidationMessage({
        type: 'error',
        message: 'Failed to delete candidate. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedPosition = positions.find((p) => p.id === formData.position)
  const isCollegePosition = selectedPosition?.type === "college"
  const selectedParty = parties.find((p) => p.id === formData.party)
  const selectedCollege = colleges.find((c) => c.id === formData.college)

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
                  <img
                    src={candidate.photo || "/placeholder.svg?height=48&width=48"}
                    alt={candidate.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{candidate.name}</h4>
                  <p className="text-sm text-gray-600">{positions.find((p) => p.id === candidate.position)?.name}</p>
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {getModalTitle()}
            </div>
            {/* <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button> */}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{getModalDescription()}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Photo Upload Section */}
            <div className="lg:col-span-1">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <Label className="text-sm font-medium">Candidate Photo</Label>
                </div>
                <CandidatePhotoUpload value={formData.photo} onChange={(photo) => handleInputChange("photo", photo)} />
              </div>
            </div>

            {/* Form Fields Section */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  <h3 className="font-medium">Basic Information</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter candidate's full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                      <SelectTrigger className={errors.position ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select position" />
                      </SelectTrigger>
                      <SelectContent>
                        {positions.map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.name} ({position.type.toUpperCase()})
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
                          <SelectItem key={party.id} value={party.id}>
                            <div className="flex items-center">
                              <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: party.color }} />
                              {party.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.party && <p className="text-sm text-red-500">{errors.party}</p>}
                  </div>

                  {isCollegePosition && (
                    <div className="space-y-2">
                      <Label htmlFor="college">College *</Label>
                      <Select value={formData.college} onValueChange={(value) => handleInputChange("college", value)}>
                        <SelectTrigger className={errors.college ? "border-red-500" : ""}>
                          <SelectValue placeholder="Select college" />
                        </SelectTrigger>
                        <SelectContent>
                          {colleges.map((college) => (
                            <SelectItem key={college.id} value={college.id}>
                              {college.name} ({college.shortName})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.college && <p className="text-sm text-red-500">{errors.college}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4" />
                  <h3 className="font-medium">Additional Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      placeholder="Enter candidate's biography and background..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform & Agenda</Label>
                    <Textarea
                      id="platform"
                      placeholder="Enter candidate's platform, goals, and agenda..."
                      value={formData.platform}
                      onChange={(e) => handleInputChange("platform", e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          {formData.name && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-medium">Preview</h3>
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                  <img
                    src={formData.photo || "/placeholder.svg?height=80&width=80"}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{formData.name}</h4>
                  <p className="text-sm text-gray-600">
                    {selectedPosition?.name} candidate
                    {isCollegePosition && selectedCollege && <span> • {selectedCollege.shortName}</span>}
                  </p>
                  {selectedParty && (
                    <div className="mt-2">
                      <Badge style={{ backgroundColor: selectedParty.color }}>{selectedParty.name}</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Validation Message */}
          {validationMessage.message && (
            <div className={`p-3 rounded-lg ${
              validationMessage.type === 'error' 
                ? 'bg-red-50 border border-red-200 text-red-800' 
                : 'bg-green-50 border border-green-200 text-green-800'
            }`}>
              <p className="text-sm">{validationMessage.message}</p>
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
