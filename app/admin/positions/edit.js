"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Crown, Users, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function EditPositionPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    type: "ssc",
    maxSelections: 1,
    description: "",
    requirements: "",
    isActive: true,
    allowSkip: true,
  })
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadPositionData = async () => {
      try {
        setIsDataLoading(true)

        // Mock positions data - in a real app, this would come from an API
        const positions = [
          {
            id: "president",
            name: "President",
            type: "ssc",
            maxSelections: 1,
            description: "Leads the Supreme Student Council and represents all students in university matters.",
            requirements: "Must be a full-time student with good academic standing and leadership experience.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "vice-president",
            name: "Vice President",
            type: "ssc",
            maxSelections: 1,
            description: "Assists the President and assumes presidential duties when necessary.",
            requirements: "Must be a full-time student with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "senator",
            name: "Senator",
            type: "ssc",
            maxSelections: 10,
            description: "Represents student interests and participates in legislative functions of the SSC.",
            requirements: "Must be a full-time student with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "governor",
            name: "Governor",
            type: "college",
            maxSelections: 1,
            description: "Leads the college student government and represents college interests.",
            requirements: "Must be a student of the respective college with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "vice-governor",
            name: "Vice Governor",
            type: "college",
            maxSelections: 1,
            description: "Assists the Governor and assumes gubernatorial duties when necessary.",
            requirements: "Must be a student of the respective college with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "mayor",
            name: "Mayor",
            type: "college",
            maxSelections: 1,
            description: "Manages college-level programs and student activities.",
            requirements: "Must be a student of the respective college with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "vice-mayor",
            name: "Vice Mayor",
            type: "college",
            maxSelections: 1,
            description: "Assists the Mayor in managing college programs and activities.",
            requirements: "Must be a student of the respective college with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
          {
            id: "board-member",
            name: "Board Member",
            type: "college",
            maxSelections: 6,
            description: "Participates in college governance and represents student interests in college matters.",
            requirements: "Must be a student of the respective college with good academic standing.",
            isActive: true,
            allowSkip: true,
          },
        ]

        // Find the position by ID
        const position = positions.find((p) => p.id === params.id)

        if (position) {
          setFormData({
            name: position.name,
            id: position.id,
            type: position.type,
            maxSelections: position.maxSelections,
            description: position.description || "",
            requirements: position.requirements || "",
            isActive: position.isActive !== false,
            allowSkip: position.allowSkip !== false,
          })
        } else {
          setNotFound(true)
          toast({
            title: "Position Not Found",
            description: "The position you're trying to edit doesn't exist.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error loading position data:", error)
        toast({
          title: "Error",
          description: "Failed to load position data. Please try again.",
          variant: "destructive",
        })
        setNotFound(true)
      } finally {
        setIsDataLoading(false)
      }
    }

    if (params.id) {
      loadPositionData()
    }
  }, [params.id, toast])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.type) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate max selections
      if (formData.maxSelections < 1 || formData.maxSelections > 50) {
        toast({
          title: "Validation Error",
          description: "Maximum selections must be between 1 and 50.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // In a real app, this would call an API to update the position
      console.log("Updating position:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Position has been updated successfully.",
      })

      // Redirect back to positions page
      router.push("/admin/positions")
    } catch (error) {
      console.error("Error updating position:", error)
      toast({
        title: "Error",
        description: "Failed to update position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state
  if (isDataLoading) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Loading Position...</h1>
            <p className="text-muted-foreground">Please wait while we load the position data.</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-muted-foreground">Loading position data...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Position Not Found</h1>
            <p className="text-muted-foreground">The position you're trying to edit doesn't exist.</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium">Position not found</h3>
              <p className="text-muted-foreground">The position with ID "{params.id}" could not be found.</p>
              <Button onClick={() => router.push("/admin/positions")} className="mt-2">
                Return to Positions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Position</h1>
          <p className="text-muted-foreground">Update information for {formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Position Type Display */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {formData.type === "ssc" ? (
                    <Crown className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Users className="h-5 w-5 text-green-500" />
                  )}
                  Position Type
                </CardTitle>
                <CardDescription>Position type cannot be changed after creation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Election Type</Label>
                  <Select value={formData.type} disabled>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssc">
                        <div className="flex items-center">
                          <Crown className="h-4 w-4 mr-2 text-blue-500" />
                          SSC Position
                        </div>
                      </SelectItem>
                      <SelectItem value="college">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-green-500" />
                          College Position
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{formData.type === "ssc" ? "SSC Position" : "College Position"}</AlertTitle>
                  <AlertDescription>
                    {formData.type === "ssc"
                      ? "This position is available to all students university-wide."
                      : "This position is available to students within each college separately."}
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Form Fields Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Update the position's basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Position Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., President, Governor, Board Member"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id">Position ID</Label>
                    <Input id="id" value={formData.id} disabled className="bg-gray-50" />
                    <p className="text-xs text-muted-foreground">Position ID cannot be changed after creation.</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSelections">Maximum Selections *</Label>
                  <Input
                    id="maxSelections"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="e.g., 1 for President, 10 for Senators"
                    value={formData.maxSelections}
                    onChange={(e) => handleInputChange("maxSelections", Number.parseInt(e.target.value) || 1)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of candidates voters can select for this position.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information */}
            <Card>
              <CardHeader>
                <CardTitle>Position Details</CardTitle>
                <CardDescription>Update additional information about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the role and responsibilities of this position..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Requirements & Qualifications</Label>
                  <Textarea
                    id="requirements"
                    placeholder="List any requirements, qualifications, or criteria for this position..."
                    value={formData.requirements}
                    onChange={(e) => handleInputChange("requirements", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Position Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Position Settings</CardTitle>
                <CardDescription>Configure how this position behaves in elections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isActive">Active Position</Label>
                    <p className="text-sm text-muted-foreground">
                      Whether this position is currently available for elections
                    </p>
                  </div>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowSkip">Allow Skip</Label>
                    <p className="text-sm text-muted-foreground">
                      Whether voters can skip this position without making a selection
                    </p>
                  </div>
                  <Switch
                    id="allowSkip"
                    checked={formData.allowSkip}
                    onCheckedChange={(checked) => handleInputChange("allowSkip", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preview Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Preview how the position will appear in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {formData.type === "ssc" ? (
                    <Crown className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Users className="h-5 w-5 text-green-500" />
                  )}
                  <h3 className="font-semibold text-lg">{formData.name}</h3>
                </div>
                <div className="flex gap-2">
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      formData.type === "ssc" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    }`}
                  >
                    {formData.type.toUpperCase()}
                  </span>
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Max: {formData.maxSelections}
                  </span>
                </div>
              </div>
              {formData.description && <p className="text-sm text-gray-600 mb-2">{formData.description}</p>}
              {formData.requirements && <p className="text-xs text-gray-500">Requirements: {formData.requirements}</p>}
              <div className="flex gap-2 mt-3">
                <span className={`text-xs ${formData.isActive ? "text-green-600" : "text-red-600"}`}>
                  {formData.isActive ? "● Active" : "● Inactive"}
                </span>
                <span className="text-xs text-gray-500">{formData.allowSkip ? "● Skippable" : "● Required"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#1E90FF] hover:bg-blue-600">
            {isLoading ? (
              "Updating..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Position
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
