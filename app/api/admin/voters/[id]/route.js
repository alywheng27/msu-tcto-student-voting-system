import { connectToDB } from "@/lib/db"

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { firstName, middleName, surname, extensionName, college, username, role, password } = body
        console.log(id)
        // Input validation
        if (!id || !firstName || !surname || !college || !username || !role) {
            console.log(id, firstName, middleName, surname, extensionName, college, role, username, password)
            return Response.json({
                message: "Missing required fields: id, first name, surname, college, username, and role are required."
            }, {
                status: 400
            })
        }

        const pool = await connectToDB()

        // Find CollegeOfficeID based on college
        const collegeResult = await pool.request()
            .input('college', college)
            .query("SELECT CollegeOfficeID FROM CollegeOffice WHERE CollegeOffice = @college")

        if (collegeResult.rowsAffected < 1) {
            return Response.json({
                message: "Invalid college."
            }, {
                status: 400
            })
        }
        const collegeOfficeID = collegeResult.recordset[0].CollegeOfficeID

        // Find UserTypeID based on role
        const userTypeResult = await pool.request()
            .input('role', role)
            .query("SELECT UserTypeID FROM UserType WHERE UserType = @role")

        if (userTypeResult.rowsAffected < 1) {
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

        const result = await dbRequest.query(updateQuery)

        if (result.rowsAffected < 1) {
            return Response.json({
                message: "Voter not found or no changes made."
            }, {
                status: 404
            })
        }

        return Response.json({
            message: "Voter updated successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("Error updating voter:", err.message)
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
}

export async function DELETE(request, { params }) {
    try {
        const { id } = await params
        if (!id) {
            return Response.json({ message: "Missing required field: id is required." }, { status: 400 })
        }
        
        const pool = await connectToDB()
        
        // First delete from Voter table
        const voterResult = await pool.request()
            .input('id', id)
            .query('DELETE FROM Voter WHERE UserID = @id')

        // Then delete from Users table
        const userResult = await pool.request()
            .input('id', id)
            .query('DELETE FROM Users WHERE UserID = @id')

        if (userResult.rowsAffected < 1) {
            return Response.json({
                message: "Voter not found or already deleted."
            }, {
                status: 404
            })
        }

        return Response.json({
            message: "Voter deleted successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("Error deleting voter:", err.message)
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
} 