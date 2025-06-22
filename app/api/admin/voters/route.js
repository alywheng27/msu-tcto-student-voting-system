import { connectToDB } from "@/lib/db"

export async function GET() {
    console.log("[VOTERS] GET request received");
    try {
        console.log("[VOTERS] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[VOTERS] Connected to DB");
        console.log("[VOTERS] Querying voters...");
        const result = await pool.request().query(`
            SELECT 
                U.UserID, U.FirstName, U.MiddleName, U.Surname, U.ExtensionName, U.Username,
                V.VoterID, V.HasVotedSSC, V.HasVotedCollege,
                C.CollegeOffice, C.CollegeOfficeCode, C.CollegeOfficeColor,
                UT.UserType
            FROM 
                Voter AS V
            JOIN 
                Users AS U ON U.UserID = V.UserID
            JOIN 
                CollegeOffice AS C ON C.CollegeOfficeID = U.CollegeOfficeID
            JOIN 
                UserType AS UT ON UT.UserTypeID = U.UserTypeID
        `)
        if (result.recordset && result.recordset.length > 0) {
            console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[VOTERS] No voters found.");
            return Response.json({ message: "No voters found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        console.log("[VOTERS] Voters fetched successfully");
        return Response.json(result.recordset, { status: 200 })
    } catch (err) {
        console.error("[VOTERS] Error fetching voters:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}

export async function POST(request) {
    console.log("[VOTERS] POST request received");
    try {
        const body = await request.json()
        const { firstName, middleName, surname, extensionName, college, username, role, password } = body
        console.log("[VOTERS] Form data received:", { firstName, middleName, surname, extensionName, college, username, role });

        // Input validation
        if (!firstName || !surname || !college || !username || !role || !password) {
            console.error("[VOTERS] Missing required fields: first name, surname, college, username, role, and/or password");
            return Response.json({
                message: "Missing required fields: first name, surname, college, username, role, and password are required."
            }, {
                status: 400
            })
        }

        console.log("[VOTERS] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[VOTERS] Connected to DB");

        // Find CollegeTypeID based on type
        console.log("[VOTERS] Querying CollegeOffice for:", college);
        const typeResult = await pool.request()
            .input('college', college)
            .query("SELECT CollegeOfficeID FROM CollegeOffice WHERE CollegeOffice = @college")
        if (typeResult.recordset && typeResult.recordset.length > 0) {
            console.table(typeResult.recordset);
        }

        if (typeResult.rowsAffected < 1) {
            console.error("[VOTERS] Invalid college.");
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const collegeOfficeID = typeResult.recordset[0].CollegeOfficeID

        // Find UserTypeID based on type
        console.log("[VOTERS] Querying UserType for:", role);
        const userResult = await pool.request()
            .input('role', role)
            .query("SELECT UserTypeID FROM UserType WHERE UserType = @role")
        if (userResult.recordset && userResult.recordset.length > 0) {
            console.table(userResult.recordset);
        }

        if (userResult.rowsAffected < 1) {
            console.error("[VOTERS] Invalid user type.");
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const userTypeID = userResult.recordset[0].UserTypeID

        // Insert into Users table
        console.log("[VOTERS] Inserting new user...");
        const result = await pool.request()
            .input('firstName', firstName)
            .input('middleName', middleName)
            .input('surname', surname)
            .input('extensionName', extensionName)
            .input('collegeOfficeID', collegeOfficeID)
            .input('username', username)
            .input('userTypeID', userTypeID)
            .input('password', password)
            .query(`
                INSERT INTO Users (FirstName, MiddleName, Surname, ExtensionName, CollegeOfficeID, Username, UserTypeID, Password)
                VALUES (@firstName, @middleName, @surname, @extensionName, @collegeOfficeID, @username, @userTypeID, @password)
            `)
        if (result.recordset && result.recordset.length > 0) {
            console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[VOTERS] Failed to add user.");
            return Response.json({
                message: "Failed to add position."
            }, {
                status: 500
            })
        }

        // Get the new user
        console.log("[VOTERS] Querying for new user...");
        const user = await pool.request()
            .input('firstName', firstName)
            .input('middleName', middleName)
            .input('surname', surname)
            .input('extensionName', extensionName)
            .input('collegeOfficeID', collegeOfficeID)
            .input('username', username)
            .input('userTypeID', userTypeID)
            .input('password', password)
            .query("SELECT UserID FROM Users WHERE FirstName = @firstName AND MiddleName = @middleName AND Surname = @surname AND CollegeOfficeID = @collegeOfficeID AND Username = @username AND UserTypeID = @userTypeID AND password = @password AND ExtensionName = @extensionName")
        if (user.recordset && user.recordset.length > 0) {
            console.table(user.recordset);
        }

        if (user.rowsAffected < 1) {
            console.error("[VOTERS] Failed to find new user after insert.");
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const userID = user.recordset[0].UserID

        // Insert into Voter table
        console.log("[VOTERS] Inserting into Voter table...");
        const resultUser = await pool.request()
            .input('userID', userID)
            .query(`
                INSERT INTO Voter (UserID)
                VALUES (@userID)
            `)
        if (resultUser.recordset && resultUser.recordset.length > 0) {
            console.table(resultUser.recordset);
        }

        if (resultUser.rowsAffected < 1) {
            console.error("[VOTERS] Failed to add voter.");
            return Response.json({
                message: "Failed to add position."
            }, {
                status: 500
            })
        }

        console.log("[VOTERS] Voter added successfully.");
        return Response.json({
            message: "Position added successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("[VOTERS] Error adding voter:", err.message, err);
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
}