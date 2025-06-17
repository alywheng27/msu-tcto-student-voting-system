"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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

export default function AddPositionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    type: searchParams.get("type") || "ssc",
    maxSelections: 1,
    description: "",
    requirements: "",
    isActive: true,
    allowSkip: true,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate ID from name (for convenience)
    if (field === "name") {
      const generatedId = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
      setFormData((prev) => ({ ...prev, id: generatedId }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.id || !formData.type) {
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

      // In a real app, this would call an API to save the position
      console.log("Saving position:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Success",
        description: "Position has been created successfully.",
      })

      // Redirect back to positions page
      router.push("/admin/positions")
    } catch (error) {
      console.error("Error saving position:", error)
      toast({
        title: "Error",
        description: "Failed to create position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Add New Position</h1>
          <p className="text-muted-foreground">Create a new election position for SSC or college elections</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Position Type Selection */}
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
                <CardDescription>Select the type of election position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Election Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position type" />
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
                      ? "This position will be available to all students university-wide."
                      : "This position will be available to students within each college separately."}
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
                <CardDescription>Enter the position&apos;s basic details</CardDescription>
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
                    <Label htmlFor="id">Position ID *</Label>
                    <Input
                      id="id"
                      placeholder="e.g., president, governor, board-member"
                      value={formData.id}
                      onChange={(e) => handleInputChange("id", e.target.value)}
                      required
                      pattern="[a-z0-9\-]+"
                      title="Lowercase letters, numbers, and hyphens only"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for internal references. Only lowercase letters, numbers, and hyphens.
                    </p>
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
                <CardDescription>Provide additional information about the position</CardDescription>
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
        {formData.name && (
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
                {formData.requirements && (
                  <p className="text-xs text-gray-500">Requirements: {formData.requirements}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <span className={`text-xs ${formData.isActive ? "text-green-600" : "text-red-600"}`}>
                    {formData.isActive ? "● Active" : "● Inactive"}
                  </span>
                  <span className="text-xs text-gray-500">{formData.allowSkip ? "● Skippable" : "● Required"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-[#1E90FF] hover:bg-blue-600">
            {isLoading ? (
              "Creating..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Position
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
