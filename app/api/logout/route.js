import { cookies } from "next/headers"

export async function GET() {
    console.log("[LOGOUT] GET request received");
    try {
        const cookieStore = await cookies()
        console.log("[LOGOUT] Deleting user cookies...");

        cookieStore.delete("UserID")
        cookieStore.delete("UserTypeID")
        cookieStore.delete("CollegeOfficeID")
        cookieStore.delete("Username")
        cookieStore.delete("Password")
        cookieStore.delete("FirstName")
        cookieStore.delete("MiddleName")
        cookieStore.delete("Surname")
        cookieStore.delete("ExtensionName")

        console.log("[LOGOUT] All user cookies deleted.");
        return Response.json({ message: "Logout successful." }, { status: 200 })
    } catch (err) {
        console.error("[LOGOUT] Error logging out:", err.message, err);
        return Response.json({ message: "Error logging out: " + err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}