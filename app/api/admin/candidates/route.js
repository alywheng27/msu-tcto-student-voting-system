import { connectToDB } from "@/lib/db"

export async function GET() {
    console.log("[CANDIDATES] GET request received");
    try {
        console.log("[CANDIDATES] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[CANDIDATES] Connected to DB");
        console.log("[CANDIDATES] Querying candidates...");
        // NOTE: Adjust the table/column names below based on your actual DB schema
        const result = await pool.request().query(`
            SELECT 
                C.CandidateID,
                U.UserID,
                UT.UserTypeID,
                UT.UserType,
                U.FirstName,
                U.MiddleName,
                U.Surname,
                U.ExtensionName,
                U.Username,
                C.Photo,
                P.PositionID,
                PT.PositionTypeID,
                PT.PositionType,
                P.Position,
                P.MaximumSelection,
                P.Decree,
                Party.PartyID,
                Party.Party,
                Party.PartyColor,
                Party.Logo,
                CO.CollegeOfficeID,
                CO.CollegeOffice,
                CO.CollegeOfficeCode,
                CO.CollegeOfficeColor
            FROM 
                Candidate AS C
            JOIN
                Users AS U ON C.UserID = U.UserID
            JOIN
                UserType AS UT ON U.UserTypeID = UT.UserTypeID
            JOIN 
                Position AS P ON P.PositionID = C.PositionID
            JOIN 
                PositionType AS PT ON PT.PositionTypeID = P.PositionTypeID
            JOIN 
                Party ON Party.PartyID = C.PartyID
            JOIN 
                CollegeOffice AS CO ON CO.CollegeOfficeID = U.CollegeOfficeID
                
        `)

        if (result.rowsAffected < 1) {
            console.error("[CANDIDATES] No candidates found.");
            return Response.json({ message: "No candidates found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        console.log("[CANDIDATES] Candidates fetched successfully");
        return Response.json(result.recordset, { status: 200 })
    } catch (err) {
        console.error("[CANDIDATES] Error fetching candidates:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
} 