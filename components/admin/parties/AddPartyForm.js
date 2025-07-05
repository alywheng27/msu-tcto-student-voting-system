import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"
import { PartyLogoUpload } from "@/components/admin/parties/add/Party-Logo-Upload"
import { ColorPicker } from "@/components/admin/parties/add/Color-Picker"

export default function AddPartyForm({ onSuccess, onCancel, toast }) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    color: "#2196F3",
    logo: "",
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "name") {
      const generatedId = value
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
      setFormData((prev) => ({ ...prev, id: generatedId }))
    }
  }

  const validateForm = (data) => {
    if (!data.name || !data.id || !data.color) {
      return {
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      }
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const validationError = validateForm(formData)
    if (validationError) {
      toast && toast(validationError)
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/admin/parties/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to add party')
      const msg = {
        title: "Success",
        description: "Party has been added successfully.",
        variant: "success",
      }
      toast && toast(msg)
      if (onSuccess) onSuccess(msg)
    } catch (error) {
      toast && toast({
        title: "Error",
        description: error.message || "Failed to save party. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="col-span-2 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Party Logo</CardTitle>
              <CardDescription>Upload party logo</CardDescription>
            </CardHeader>
            <CardContent>
              <PartyLogoUpload value={formData.logo} onChange={(logo) => handleInputChange("logo", logo)} />
            </CardContent>
          </Card>
          
        </div>
        <div className="col-span-1 md:col-span-3 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Party Information</CardTitle>
              <CardDescription>Enter the basic details for the new party</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Party Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter party name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Party Color *</Label>
                <ColorPicker color={formData.color} onChange={(color) => handleInputChange("color", color)} id="color" />
              </div>
            </CardContent>
          </Card>
          {formData.name && (
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Preview how the party will appear in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${formData.color}15` }}
                  >
                    <Image
                      src={formData.logo || "/parties/no-logo.png"}
                      alt="Party logo preview"
                      className="w-12 h-12 object-contain"
                      width={250}
                      height={250}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{formData.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: formData.color }}
                        title={`Party color: ${formData.color}`}
                      />
                      <span className="text-xs text-gray-500">{formData.color}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="bg-[#1E90FF] hover:bg-blue-600">
          {isLoading ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Party
            </>
          )}
        </Button>
      </div>
    </form>
  )
} 