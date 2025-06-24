import { connectToDB } from "@/lib/db"

export async function GET() {
    console.log("[CANDIDATES] GET request received");
    try {
        console.log("[CANDIDATES] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[CANDIDATES] Connected to DB");
        console.log("[CANDIDATES] Querying candidates...");
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

export async function POST(request) {
    console.log("[CANDIDATES] POST request received");
    try {
        const body = await request.json();
        console.log("[CANDIDATES] POST body:", body);
        const {
            firstName, middleName, surname, extensionName, username, password, role,
            photo, positionID, partyID, collegeOfficeID
        } = body;
        if (!firstName || !surname || !positionID || !collegeOfficeID || !username || !password || !role) {
            console.error("[CANDIDATES] Missing required fields.");
            return Response.json({ message: "Missing required fields." }, { status: 400 });
        }
        const roleID = role === 'candidate' ? 3 : 1
        const pool = await connectToDB();
        const userResult = await pool.request()
            .input('firstName', firstName)
            .input('middleName', middleName)
            .input('surname', surname)
            .input('extensionName', extensionName)
            .input('username', username)
            .input('password', password)
            .input('roleID', roleID)
            .input('collegeOfficeID', collegeOfficeID)
            .query(`
                INSERT INTO Users (FirstName, MiddleName, Surname, ExtensionName, Username, Password, UserTypeID, CollegeOfficeID)
                OUTPUT INSERTED.UserID
                VALUES (@firstName, @middleName, @surname, @extensionName, @username, @password, @roleID, @collegeOfficeID)
            `);
        console.log("[CANDIDATES] User insert result:");
        console.table(userResult.recordset);
        const userID = userResult.recordset[0].UserID;
        const candidateResult = await pool.request()
            .input('userID', userID)
            .input('photo', photo)
            .input('positionID', positionID)
            .input('partyID', partyID)
            .query(`
                INSERT INTO Candidate (UserID, Photo, PositionID, PartyID)
                VALUES (@userID, @photo, @positionID, @partyID)
            `);
        console.log("[CANDIDATES] Candidate insert result:");
        console.table(candidateResult);
        if (candidateResult.rowsAffected < 1) {
            console.error("[CANDIDATES] Failed to add candidate.");
            return Response.json({ message: "Failed to add candidate." }, { status: 500 });
        }
        console.log("[CANDIDATES] Candidate added successfully.");
        return Response.json({ message: "Candidate added successfully." }, { status: 200 });
    } catch (err) {
        console.error("[CANDIDATES] Error adding candidate:", err.message, err);
        return Response.json({ message: err.message }, { status: 500 });
    }
} 