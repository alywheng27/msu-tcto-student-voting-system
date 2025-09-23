import { connectToDB } from "@/lib/db"

export async function PUT(request, { params }) {
    console.log("[VOTERS-ID] PUT request received");
    try {
        const { id } = await params
        const body = await request.json()
        const { firstName, middleName, surname, extensionName, college, username, role, password } = body
        console.log("[VOTERS-ID] Form data received:", { id, firstName, middleName, surname, extensionName, college, username, role });
        // Input validation
        if (!id || !firstName || !surname || !college || !username || !role) {
            console.error("[VOTERS-ID] Missing required fields: id, first name, surname, college, username, and/or role");
            return Response.json({
                message: "Missing required fields: id, first name, surname, college, username, and role are required."
            }, {
                status: 400
            })
        }

        console.log("[VOTERS-ID] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[VOTERS-ID] Connected to DB");

        // Find CollegeOfficeID based on college
        console.log("[VOTERS-ID] Querying CollegeOffice for:", college);
        const collegeResult = await pool.request()
            .input('college', college)
            .query("SELECT CollegeOfficeID FROM CollegeOffice WHERE CollegeOffice = @college")
        if (collegeResult.recordset && collegeResult.recordset.length > 0) {
            // console.table(collegeResult.recordset);
        }

        if (collegeResult.rowsAffected < 1) {
            console.error("[VOTERS-ID] Invalid college.");
            return Response.json({
                message: "Invalid college."
            }, {
                status: 400
            })
        }
        const collegeOfficeID = collegeResult.recordset[0].CollegeOfficeID

        // Find UserTypeID based on role
        console.log("[VOTERS-ID] Querying UserType for:", role);
        const userTypeResult = await pool.request()
            .input('role', role)
            .query("SELECT UserTypeID FROM UserType WHERE UserType = @role")
        if (userTypeResult.recordset && userTypeResult.recordset.length > 0) {
            // console.table(userTypeResult.recordset);
        }

        if (userTypeResult.rowsAffected < 1) {
            console.error("[VOTERS-ID] Invalid user type.");
            return Response.json({
                message: "Invalid user type."
            }, {
                status: 400
            })
        }
        const userTypeID = userTypeResult.recordset[0].UserTypeID

        // Update the user
        let updateQuery = `
            UPDATE Users 
            SET FirstName = @firstName,
                MiddleName = @middleName,
                Surname = @surname,
                ExtensionName = @extensionName,
                CollegeOfficeID = @collegeOfficeID,
                Username = @username,
                UserTypeID = @userTypeID
        `

        // Add password update if provided
        if (password) {
            updateQuery += `, Password = @password`
        }

        updateQuery += ` WHERE UserID = @id`

        const dbRequest = pool.request()
            .input('id', id)
            .input('firstName', firstName)
            .input('middleName', middleName)
            .input('surname', surname)
            .input('extensionName', extensionName)
            .input('collegeOfficeID', collegeOfficeID)
            .input('username', username)
            .input('userTypeID', userTypeID)

        if (password) {
            dbRequest.input('password', password)
        }

        console.log("[VOTERS-ID] Updating user...");
        const result = await dbRequest.query(updateQuery)
        if (result.recordset && result.recordset.length > 0) {
            // console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[VOTERS-ID] Voter not found or no changes made.");
            return Response.json({
                message: "Voter not found or no changes made."
            }, {
                status: 404
            })
        }

        console.log("[VOTERS-ID] Voter updated successfully.");
        return Response.json({
            message: "Voter updated successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("[VOTERS-ID] Error updating voter:", err.message, err);
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
}

export async function DELETE(request, { params }) {
    console.log("[VOTERS-ID] DELETE request received");
    try {
        const { id } = await params
        console.log("[VOTERS-ID] Deleting voter with id:", id);
        if (!id) {
            console.error("[VOTERS-ID] Missing required field: id");
            return Response.json({ message: "Missing required field: id is required." }, { status: 400 })
        }
        console.log("[VOTERS-ID] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[VOTERS-ID] Connected to DB");
        // First delete from Voter table
        console.log("[VOTERS-ID] Deleting from Voter table...");
        const voterResult = await pool.request()
            .input('id', id)
            .query('DELETE FROM Voter WHERE UserID = @id')
        if (voterResult.recordset && voterResult.recordset.length > 0) {
            // console.table(voterResult.recordset);
        }
        // Then delete from Users table
        console.log("[VOTERS-ID] Deleting from Users table...");
        const userResult = await pool.request()
            .input('id', id)
            .query('DELETE FROM Users WHERE UserID = @id')
        if (userResult.recordset && userResult.recordset.length > 0) {
            // console.table(userResult.recordset);
        }

        if (userResult.rowsAffected < 1) {
            console.error("[VOTERS-ID] Voter not found or already deleted.");
            return Response.json({
                message: "Voter not found or already deleted."
            }, {
                status: 404
            })
        }

        console.log("[VOTERS-ID] Voter deleted successfully.");
        return Response.json({
            message: "Voter deleted successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("[VOTERS-ID] Error deleting voter:", err.message, err);
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
} 