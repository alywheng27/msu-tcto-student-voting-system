import { connectToDB } from "@/lib/db"

export async function GET() {
    try {
        const pool = await connectToDB()
        const result = await pool.request().query("SELECT * FROM Position JOIN PositionType ON Position.PositionTypeID = PositionType.PositionTypeID ")

        if(result.rowsAffected < 1){
            console.log("0 position found.")
            // Error response needs to have status
            return Response.json({ message: "0 position found.",  }, { 
                headers: {
                    "Content-Type": "application/json",
                },
                status: 401 
            })
        }

        console.log("Positions fetched succesfully")
        return Response.json(result.recordset)
    } catch (err) {
        console.error("Error fetching positions.", err.message)
        // Error response needs to have status
        return Response.json({ message: err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
}