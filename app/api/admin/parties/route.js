import { connectToDB } from "@/lib/db"

export async function GET() {
    console.log("[PARTIES] GET request received");
    try {
        console.log("[PARTIES] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[PARTIES] Connected to DB");
        console.log("[PARTIES] Querying Party table...");
        const result = await pool.request().query("SELECT * FROM Party ")
        
        if(result.rowsAffected < 1){
            console.error("[PARTIES] 0 party found.");
            // Error response needs to have status
            return Response.json({ message: "0 party found.",  }, { 
                headers: {
                    "Content-Type": "application/json",
                },
                status: 401 
            })
        }

        console.log("[PARTIES] Parties fetched succesfully");
        return Response.json(result.recordset)
    } catch (err) {
        console.error("[PARTIES] Error fetching parties.", err.message, err);
        // Error response needs to have status
        return Response.json({ message: err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
}