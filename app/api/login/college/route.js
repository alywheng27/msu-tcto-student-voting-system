import { connectToDB } from '@/lib/db'

export async function GET() {
    console.log("[COLLEGE-LOGIN] GET request received");
    try {
        console.log("[COLLEGE-LOGIN] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[COLLEGE-LOGIN] Connected to DB");
        console.log("[COLLEGE-LOGIN] Querying CollegeOffice...");
        const result = await pool.request().query("SELECT TOP 6 * FROM CollegeOffice")
        console.log("[COLLEGE-LOGIN] Query result:");
        console.table(result.recordset)

        if (result.rowsAffected < 1) {
            console.error("[COLLEGE-LOGIN] No colleges found.");
            return Response.json({ message: "No colleges found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        console.log("[COLLEGE-LOGIN] Colleges fetched successfully.");
        return Response.json(result.recordset, { status: 200 })
    } catch (error) {
        console.error("[COLLEGE-LOGIN] Error fetching colleges:", error.message, error);
        return Response.json({ message: error.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}