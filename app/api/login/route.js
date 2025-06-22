import { connectToDB } from "@/lib/db";
import { cookies } from "next/headers"

export async function POST(req) {
    console.log("[LOGIN] POST request received");
    try {
        console.log("[LOGIN] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[LOGIN] Connected to DB");
        const form = await req.json()
        console.log("[LOGIN] Form data received:", { username: form.username, role: form.role, college: form.college });

        // Input validation
        if (!form.username || !form.password) {
            console.error("[LOGIN] Missing required fields: username and/or password");
            return Response.json({ message: "Missing required fields: username and password are required." }, { status: 400 })
        }

        // Do not log sensitive data like passwords
        console.log("[LOGIN] Attempting login for username:", form.username, "Role:", form.role || "None", "College:", form.college || "None")

        console.log("[LOGIN] Querying user in DB...");
        const result = await pool.request()
            .input('username', form.username)
            .input('password', form.password)
            .query("SELECT * FROM Users WHERE username = @username AND password = @password")
        console.table("[LOGIN] Query result:", result.recordset);

        if (
            result.rowsAffected < 1 ||
            (result.recordset[0].UserTypeID == 1 && form.role == 'voter') ||
            (result.recordset[0].UserTypeID == 2 && form.role == 'admin')
        ) {
            console.error("[LOGIN] Invalid credentials or mismatched role.");
            return Response.json({ message: "Invalid credentials. Please check your username, password, and selected college." }, {
                headers: { "Content-Type": "application/json" },
                status: 401
            })
        }

        const cookieStore = await cookies()
        console.log("[LOGIN] Setting cookies for user:", result.recordset[0].Username);
        cookieStore.set("UserID", result.recordset[0].UserID)
        cookieStore.set("UserTypeID", result.recordset[0].UserTypeID)
        cookieStore.set("CollegeOfficeID", result.recordset[0].CollegeOfficeID)
        cookieStore.set("Username", result.recordset[0].Username)
        cookieStore.set("Password", result.recordset[0].Password)
        cookieStore.set("FirstName", result.recordset[0].FirstName)
        cookieStore.set("MiddleName", result.recordset[0].MiddleName)
        cookieStore.set("Surname", result.recordset[0].Surname)
        cookieStore.set("ExtensionName", result.recordset[0].ExtensionName)

        console.log("[LOGIN]", form.username + " logged in successfully.")
        return Response.json(result.recordset, { status: 200 })
    } catch (err) {
        console.error("[LOGIN] Error logging in:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}