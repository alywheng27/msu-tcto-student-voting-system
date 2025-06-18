import { connectToDB } from '@/lib/db'

export async function GET() {
    try {
        const pool = await connectToDB()
        const result = await pool.request().query("SELECT TOP 6 * FROM CollegeOffice")

        if (result.rowsAffected < 1) {
            return Response.json({ message: "No colleges found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        return Response.json(result.recordset, { status: 200 })
    } catch (error) {
        console.error("Error fetching colleges:", error.message)
        return Response.json({ message: error.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}