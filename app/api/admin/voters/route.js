import { connectToDB } from "@/lib/db"

export async function GET() {
    try {
        const pool = await connectToDB()
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

export async function POST(request) {
    try {
        const body = await request.json()
        const { firstName, middleName, surname, extensionName, college, username, role, password } = body

        // Input validation
        if (!firstName || !surname || !college || !username || !role || !password) {
            console.log(firstName, surname, college, username, role, password)
            return Response.json({
                message: "Missing required fields: first name, surname, college, username, role, and password are required."
            }, {
                status: 400
            })
        }

        const pool = await connectToDB()

        // Find CollegeTypeID based on type
        const typeResult = await pool.request()
            .input('college', college)
            .query("SELECT CollegeOfficeID FROM CollegeOffice WHERE CollegeOffice = @college")

        if (typeResult.rowsAffected < 1) {
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const collegeOfficeID = typeResult.recordset[0].CollegeOfficeID

        // Find CollegeTypeID based on type
        const userResult = await pool.request()
            .input('role', role)
            .query("SELECT UserTypeID FROM UserType WHERE UserType = @role")

        if (userResult.rowsAffected < 1) {
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const userTypeID = userResult.recordset[0].UserTypeID

        // Insert into Voter table
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

        if (result.rowsAffected < 1) {
            return Response.json({
                message: "Failed to add position."
            }, {
                status: 500
            })
        }

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

        if (user.rowsAffected < 1) {
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const userID = user.recordset[0].UserID

        // Insert into Voter table
        const resultUser = await pool.request()
            .input('userID', userID)
            .query(`
                INSERT INTO Voter (UserID)
                VALUES (@userID)
            `)

        if (resultUser.rowsAffected < 1) {
            return Response.json({
                message: "Failed to add position."
            }, {
                status: 500
            })
        }

        return Response.json({
            message: "Position added successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("Error adding position:", err.message)
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
}