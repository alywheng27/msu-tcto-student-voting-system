"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Crown, Users, AlertCircle, X, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AddPositionModal({ isOpen, onClose, defaultType = "ssc", onSuccess }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    type: defaultType,
    maxSelections: 1,
    orderNumber: 1,
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

  // Helper function para mag-reset ng form
  const getInitialFormData = () => ({
    name: "",
    id: "",
    type: defaultType,
    maxSelections: 1,
    orderNumber: 1,
    description: "",
    requirements: "",
    isActive: true,
    allowSkip: true,
  })

  // Helper function para sa validation
  const validateForm = (data) => {
    if (!data.name || !data.id || !data.type) {
      return {
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      }
    }
    if (data.maxSelections < 1 || data.maxSelections > 50) {
      return {
        title: "Validation Error",
        description: "Maximum selections must be between 1 and 50.",
        variant: "destructive",
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Validation
    const validationError = validateForm(formData)
    if (validationError) {
      onSuccess?.(validationError)
      setIsLoading(false)
      return
    }

    try {
      // await new Promise((resolve) => setTimeout(resolve, 1000))
      const response = await fetch('/api/admin/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          id: formData.id,
          type: formData.type,
          maxSelections: formData.maxSelections,
          orderNumber: formData.orderNumber,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to add position')
      }

      onSuccess?.({
        title: "Success",
        description: "Position has been created successfully.",
        variant: "success",
      })

      setFormData(getInitialFormData())
      onClose()
    } catch (error) {
      console.error("Error saving position:", error)
      onSuccess?.({
        title: "Error",
        description: error.message || "Failed to create position. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setFormData(getInitialFormData())
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add New Position
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
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
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the position&apos;s basic details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-1 gap-4">
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
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order of Position *</Label>
                    <Input
                      id="orderNumber"
                      type="number"
                      min="1"
                      max="50"
                      placeholder="e.g., 1 for President, 2 for Vice President"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange("orderNumber", Number.parseInt(e.target.value) || 1)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Arrangement of position by order.
                    </p>
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
                      <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        Order: {formData.orderNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
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
      </DialogContent>
    </Dialog>
  )
} 