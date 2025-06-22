import { connectToDB } from "@/lib/db"

export async function PUT(request, { params }) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, type, maxSelections, orderNumber } = body

        // Input validation
        if (!id || !name || !type || !maxSelections || !orderNumber) {
            return Response.json({
                message: "Missing required fields: id, name, type, maxSelections, and orderNumber are required."
            }, {
                status: 400
            })
        }

        const pool = await connectToDB()
        // Find PositionTypeID based on type
        const typeResult = await pool.request()
            .input('type', type)
            .query("SELECT PositionTypeID FROM PositionType WHERE PositionType = @type")

        if (typeResult.rowsAffected < 1) {
            return Response.json({
                message: "Invalid position type."
            }, {
                status: 400
            })
        }
        const positionTypeID = typeResult.recordset[0].PositionTypeID

        // Update the position
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

        if (result.rowsAffected < 1) {
            return Response.json({
                message: "Position not found or no changes made."
            }, {
                status: 404
            })
        }

        return Response.json({
            message: "Position updated successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("Error updating position:", err.message)
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
        const result = await pool.request()
            .input('id', id)
            .query('DELETE FROM Position WHERE PositionID = @id')

        if (result.rowsAffected < 1) {
            return Response.json({
                message: "Position not found or already deleted."
            }, {
                status: 404
            })
        }

        return Response.json({
            message: "Position deleted successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("Error deleting position:", err.message)
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
} 