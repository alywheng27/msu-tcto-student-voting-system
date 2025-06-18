import { connectToDB } from "@/lib/db"

export async function GET() {
    try {
        const pool = await connectToDB()
        const result = await pool.request().query("SELECT * FROM Position JOIN PositionType ON Position.PositionTypeID = PositionType.PositionTypeID ")

        if (result.rowsAffected < 1) {
            return Response.json({ message: "No positions found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        return Response.json(result.recordset, { status: 200 })
    } catch (err) {
        console.error("Error fetching positions:", err.message)
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, id, type, maxSelections, orderNumber } = body

        // Input validation
        if (!name || !id || !type || !maxSelections || !orderNumber) {
            return Response.json({
                message: "Missing required fields: name, id, type, maxSelections, and orderNumber are required."
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

        // Insert into Position table
        const result = await pool.request()
            .input('name', name)
            .input('positionTypeID', positionTypeID)
            .input('maxSelections', maxSelections)
            .input('orderNumber', orderNumber)
            .query(`
                INSERT INTO Position (Position, PositionTypeID, MaximumSelection, Decree)
                VALUES (@name, @positionTypeID, @maxSelections, @orderNumber)
            `)

        if (result.rowsAffected < 1) {
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