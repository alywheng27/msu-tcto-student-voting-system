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

        // Helper function to get CollegeOfficeID
        async function getCollegeOfficeID(college) {
            const collegeIDResult = await pool.request()
                .input('college', college)
                .query("SELECT CollegeOfficeID FROM CollegeOffice WHERE CollegeOffice = @college")
            return collegeIDResult.recordset[0]?.CollegeOfficeID
        }

        let userQuery, userRequest;
        if (form.college && form.role === 'voter') {
            const collegeOfficeID = await getCollegeOfficeID(form.college)
            userQuery = `
                SELECT 
                    U.*,
                    V.VoterID,
                    V.HasVotedSSC,
                    V.HasVotedCollege,
                    C.CandidateID,
                    C.Photo,
                    P.PositionID,
                    P.Position,
                    Party.PartyID,
                    Party.Party,
                    Party.PartyColor,
                    Party.Logo
                FROM Users U
                LEFT JOIN Voter V ON U.UserID = V.UserID
                LEFT JOIN Candidate C ON U.UserID = C.UserID
                LEFT JOIN Position P ON C.PositionID = P.PositionID
                LEFT JOIN Party ON C.PartyID = Party.PartyID
                WHERE U.username = @username AND U.password = @password AND U.CollegeOfficeID = @college
            `;
            userRequest = pool.request()
                .input('username', form.username)
                .input('password', form.password)
                .input('college', collegeOfficeID)
        } else {
            userQuery = `
                SELECT 
                    U.*,
                    V.VoterID,
                    V.HasVotedSSC,
                    V.HasVotedCollege,
                    C.CandidateID,
                    C.Photo,
                    P.PositionID,
                    P.Position,
                    Party.PartyID,
                    Party.Party,
                    Party.PartyColor,
                    Party.Logo
                FROM Users U
                LEFT JOIN Voter V ON U.UserID = V.UserID
                LEFT JOIN Candidate C ON U.UserID = C.UserID
                LEFT JOIN Position P ON C.PositionID = P.PositionID
                LEFT JOIN Party ON C.PartyID = Party.PartyID
                WHERE U.username = @username AND U.password = @password
            `;
            userRequest = pool.request()
                .input('username', form.username)
                .input('password', form.password)
        }
        console.log("[LOGIN] Querying user in DB...");
        const result = await userRequest.query(userQuery)
        console.log("[LOGIN] Query result:");
        console.table(result.recordset)

        if (
            result.rowsAffected < 1 ||
            (result.recordset[0].UserTypeID == 1 && (form.role == 'voter' || form.role == 'candidate')) ||
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
        
        // Set voter information if user is a voter
        if (result.recordset[0].VoterID) {
            cookieStore.set("VoterID", result.recordset[0].VoterID)
            cookieStore.set("HasVotedSSC", result.recordset[0].HasVotedSSC)
            cookieStore.set("HasVotedCollege", result.recordset[0].HasVotedCollege)
        }
        
        // Set candidate information if user is a candidate
        if (result.recordset[0].CandidateID) {
            cookieStore.set("CandidateID", result.recordset[0].CandidateID)
            cookieStore.set("CandidatePhoto", result.recordset[0].CandidatePhoto || "")
            cookieStore.set("PositionID", result.recordset[0].PositionID || "")
            cookieStore.set("Position", result.recordset[0].Position || "")
            cookieStore.set("PartyID", result.recordset[0].PartyID || "")
            cookieStore.set("Party", result.recordset[0].Party || "")
            cookieStore.set("PartyColor", result.recordset[0].PartyColor || "")
            cookieStore.set("PartyLogo", result.recordset[0].PartyLogo || "")
        }

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