import { connectToDB } from "@/lib/db"

export async function PUT(request, { params }) {
    console.log("[POSITIONS-ID] PUT request received");
    try {
        const { id } = await params
        const body = await request.json()
        const { name, type, maxSelections, orderNumber } = body
        console.log("[POSITIONS-ID] Form data received:", { id, name, type, maxSelections, orderNumber });

        // Input validation
        if (!id || !name || !type || !maxSelections || !orderNumber) {
            console.error("[POSITIONS-ID] Missing required fields: id, name, type, maxSelections, and/or orderNumber");
            return Response.json({
                message: "Missing required fields: id, name, type, maxSelections, and orderNumber are required."
            }, {
                status: 400
            })
        }

        console.log("[POSITIONS-ID] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[POSITIONS-ID] Connected to DB");
        // Find PositionTypeID based on type
        console.log("[POSITIONS-ID] Querying PositionType for type:", type);
        const typeResult = await pool.request()
            .input('type', type)
            .query("SELECT PositionTypeID FROM PositionType WHERE PositionType = @type")
        if (typeResult.recordset && typeResult.recordset.length > 0) {
            console.table(typeResult.recordset);
        }

        if (typeResult.rowsAffected < 1) {
            console.error("[POSITIONS-ID] Invalid position type.");
            return Response.json({
                message: "Invalid position type."
            }, {
                status: 400
            })
        }
        const positionTypeID = typeResult.recordset[0].PositionTypeID

        // Update the position
        console.log("[POSITIONS-ID] Updating position...");
        const result = await pool.request()
            .input('id', id)
            .input('name', name)
            .input('positionTypeID', positionTypeID)
            .input('maxSelections', maxSelections)
            .input('orderNumber', orderNumber)
            .query(`
                UPDATE Position 
                SET Position = @name,
                    PositionTypeID = @positionTypeID,
                    MaximumSelection = @maxSelections,
                    Decree = @orderNumber
                WHERE PositionID = @id
            `)
        if (result.recordset && result.recordset.length > 0) {
            console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[POSITIONS-ID] Position not found or no changes made.");
            return Response.json({
                message: "Position not found or no changes made."
            }, {
                status: 404
            })
        }

        console.log("[POSITIONS-ID] Position updated successfully.");
        return Response.json({
            message: "Position updated successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("[POSITIONS-ID] Error updating position:", err.message, err);
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
}

export async function DELETE(request, { params }) {
    console.log("[POSITIONS-ID] DELETE request received");
    try {
        const { id } = await params
        console.log("[POSITIONS-ID] Deleting position with id:", id);
        if (!id) {
            console.error("[POSITIONS-ID] Missing required field: id");
            return Response.json({ message: "Missing required field: id is required." }, { status: 400 })
        }
        console.log("[POSITIONS-ID] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[POSITIONS-ID] Connected to DB");
        const result = await pool.request()
            .input('id', id)
            .query('DELETE FROM Position WHERE PositionID = @id')
        if (result.recordset && result.recordset.length > 0) {
            console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[POSITIONS-ID] Position not found or already deleted.");
            return Response.json({
                message: "Position not found or already deleted."
            }, {
                status: 404
            })
        }

        console.log("[POSITIONS-ID] Position deleted successfully.");
        return Response.json({
            message: "Position deleted successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("[POSITIONS-ID] Error deleting position:", err.message, err);
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
} 