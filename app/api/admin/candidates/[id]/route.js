import { connectToDB } from "@/lib/db"

export async function PUT(request, { params }) {
    console.log("[CANDIDATES-ID] PUT request received");
    try {
        const { id } = params;
        console.log("[CANDIDATES-ID] PUT params:", params);
        const body = await request.json();
        console.log("[CANDIDATES-ID] PUT body:", body);
        const {
            userID, firstName, middleName, surname, extensionName, username, password, role,
            photo, positionID, partyID, collegeOfficeID
        } = body;

        if (!id || !userID) {
            console.error("[CANDIDATES-ID] Missing candidateID or userID.");
            return Response.json({ message: "Missing candidateID or userID." }, { status: 400 });
        }

        const roleID = role === 'candidate' ? 3 : 1

        const pool = await connectToDB();

        // Update Users table
        let userUpdateQuery = `
            UPDATE Users
            SET FirstName = @firstName,
                MiddleName = @middleName,
                Surname = @surname,
                ExtensionName = @extensionName,
                Username = @username,
                UserTypeID = @roleID,
                CollegeOfficeID = @collegeOfficeID`;
        if (password) {
            userUpdateQuery += ', Password = @password';
        }
        userUpdateQuery += '\nWHERE UserID = @userID';

        const userRequest = pool.request()
            .input('userID', userID)
            .input('firstName', firstName)
            .input('middleName', middleName)
            .input('surname', surname)
            .input('extensionName', extensionName)
            .input('username', username)
            .input('roleID', roleID)
            .input('collegeOfficeID', collegeOfficeID);
        if (password) {
            userRequest.input('password', password);
        }
        const userUpdateResult = await userRequest.query(userUpdateQuery);
        console.log("[CANDIDATES-ID] User update result:");
        // console.table(userUpdateResult);

        // Update Candidate table
        const result = await pool.request()
            .input('candidateID', id)
            .input('photo', photo)
            .input('positionID', positionID)
            .input('partyID', partyID)
            .query(`
                UPDATE Candidate
                SET Photo = @photo,
                    PositionID = @positionID,
                    PartyID = @partyID
                WHERE CandidateID = @candidateID
            `);
        console.log("[CANDIDATES-ID] Candidate update result:");
        // console.table(result);

        if (result.rowsAffected < 1) {
            console.error("[CANDIDATES-ID] Candidate not found or no changes made.");
            return Response.json({ message: "Candidate not found or no changes made." }, { status: 404 });
        }
        console.log("[CANDIDATES-ID] Candidate updated successfully.");
        return Response.json({ message: "Candidate updated successfully." }, { status: 200 });
    } catch (err) {
        console.error("[CANDIDATES-ID] Error updating candidate:", err.message, err);
        return Response.json({ message: err.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    console.log("[CANDIDATES-ID] DELETE request received");
    try {
        const { id } = params;
        console.log("[CANDIDATES-ID] DELETE params:", params);
        const body = await request.json();
        console.log("[CANDIDATES-ID] DELETE body:", body);
        const { userID } = body;

        if (!id || !userID) {
            console.error("[CANDIDATES-ID] Missing candidateID or userID.");
            return Response.json({ message: "Missing candidateID or userID." }, { status: 400 });
        }

        const pool = await connectToDB();

        // Delete from Candidate table
        const candidateResult = await pool.request()
            .input('candidateID', id)
            .query('DELETE FROM Candidate WHERE CandidateID = @candidateID');
        console.log("[CANDIDATES-ID] Candidate delete result:");
        // console.table(candidateResult);

        // Optionally, delete from Users table as well
        const userResult = await pool.request()
            .input('userID', userID)
            .query('DELETE FROM Users WHERE UserID = @userID');
        console.log("[CANDIDATES-ID] User delete result:");
        // console.table(userResult);

        if (candidateResult.rowsAffected < 1) {
            console.error("[CANDIDATES-ID] Candidate not found or already deleted.");
            return Response.json({ message: "Candidate not found or already deleted." }, { status: 404 });
        }
        console.log("[CANDIDATES-ID] Candidate deleted successfully.");
        return Response.json({ message: "Candidate deleted successfully." }, { status: 200 });
    } catch (err) {
        console.error("[CANDIDATES-ID] Error deleting candidate:", err.message, err);
        return Response.json({ message: err.message }, { status: 500 });
    }
}
