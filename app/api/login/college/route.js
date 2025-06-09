import { connectToDB } from '@/lib/db'

export async function GET() {
    try {
        const pool = await connectToDB()
        const result = await pool.request().query("SELECT TOP 6 * FROM CollegeOffic")

        console.log("Colleges fetched successfully")
        return Response.json(result.recordset)
    } catch (error) {
        console.error("Error fetching colleges", error.message)
        // Error response needs to have status
        return Response.json({ message: error.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
}