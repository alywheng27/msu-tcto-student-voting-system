
import { cookies } from "next/headers"

export async function GET() {
    try {
        const cookieStore = await cookies()

        cookieStore.delete("UserID")
        cookieStore.delete("UserTypeID")
        cookieStore.delete("CollegeOfficeID")
        cookieStore.delete("Username")
        cookieStore.delete("Password")
        cookieStore.delete("FirstName")
        cookieStore.delete("MiddleName")
        cookieStore.delete("Surname")
        cookieStore.delete("ExtensionName")

        console.log("Logout successfully.")
        return Response.json({ message: "Logout successfully." })
    } catch (err) {
        console.error("Error logging out.", err.message)
        // Error response needs to have status
        return Response.json({ message: "Error logging out: " + err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
    
}