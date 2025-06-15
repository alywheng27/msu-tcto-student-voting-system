"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save, CheckCircle2, XCircle } from "lucide-react"
import { PartyLogoUpload } from "@/components/admin/parties/add/Party-Logo-Upload"
import { ColorPicker } from "@/components/admin/parties/add/Color-Picker"

export default function EditPartyPage(props) {
  const params = use(props.params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    color: "#2196F3",
    logo: "",
  })
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    // Mock parties data - in a real app, this would come from an API
    const parties = [
      {
        id: "unity",
        name: "Unity Party",
        logo: "/placeholder.svg?height=100&width=100",
        color: "#2196F3",
      },
      {
        id: "progress",
        name: "Progress Party",
        logo: "/placeholder.svg?height=100&width=100",
        color: "#4CAF50",
      },
      {
        id: "reform",
        name: "Reform Party",
        logo: "/placeholder.svg?height=100&width=100",
        color: "#FF9800",
      },
    ]

    // Find the party by ID
    const party = parties.find((p) => p.id === params.id)

    if (party) {
      setFormData({
        name: party.name,
        id: party.id,
        color: party.color,
        logo: party.logo,
      })
    } else {
      setNotFound(true)
      setNotification({
        type: "error",
        message: "The party you're trying to edit doesn't exist."
      })
    }
  }, [params.id])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.color) {
        setNotification({
          type: "error",
          message: "Please fill in all required fields."
        })
        setIsLoading(false)
        return
      }

      // In a real app, this would call an API to update the party
      console.log("Updating party:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        type: "success",
        message: "Party has been updated successfully."
      })

      // Redirect back to parties page
      router.push("/admin/parties")
    } catch (error) {
      console.error("Error updating party:", error)
      setNotification({
        type: "error",
        message: "Failed to update party. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (notFound) {
    return (
      <div className="space-y-8 max-w-2xl mx-auto">
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
            notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <XCircle className="h-5 w-5" />
            )}
            <p>{notification.message}</p>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold mb-2">Party Not Found</h1>
            <p className="text-muted-foreground">The party you&aposre trying to edit doesn&apost exist.</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-medium">Party not found</h3>
              <p className="text-muted-foreground">The party with ID &quot{params.id}&quot could not be found.</p>
              <Link href="/admin/parties">
                <Button className="mt-2">Return to Parties</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <p>{notification.message}</p>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Party</h1>
          <p className="text-muted-foreground">Update information for {formData.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Party Information</CardTitle>
            <CardDescription>Update the details for this party</CardDescription>
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
              <Label htmlFor="id">Party ID</Label>
              <Input id="id" value={formData.id} disabled className="bg-gray-50" />
              <p className="text-xs text-muted-foreground">Party ID cannot be changed after creation.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Party Color *</Label>
              <ColorPicker color={formData.color} onChange={(color) => handleInputChange("color", color)} id="color" />
            </div>

            <div className="space-y-2">
              <Label>Party Logo</Label>
              <PartyLogoUpload value={formData.logo} onChange={(logo) => handleInputChange("logo", logo)} />
            </div>
          </CardContent>
        </Card>

        {/* Preview Section */}
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
                <img
                  src={formData.logo || "/placeholder.svg?height=64&width=64"}
                  alt="Party logo preview"
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{formData.name}</h3>
                <p className="text-sm text-gray-600">ID: {formData.id}</p>
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

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Link href="/admin/parties">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isLoading} className="bg-[#1E90FF] hover:bg-blue-600">
            {isLoading ? (
              "Saving..."
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Party
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
