import { connectToDB } from "@/lib/db"

export async function GET() {
    try {
        const pool = await connectToDB()
        const result = await pool.request().query("SELECT * FROM Voter JOIN Users ON Users.UserID = Voter.UserID JOIN CollegeOffice ON CollegeOffice.CollegeOfficeID = Users.CollegeOfficeID JOIN UserType ON UserType.UserTypeID = Users.UserTypeID ")

        if (result.rowsAffected < 1) {
            return Response.json({ message: "No voters found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        console.log("Voters fetched successfully")
        return Response.json(result.recordset, { status: 200 })
    } catch (err) {
        console.error("Error fetching voters:", err.message)
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}