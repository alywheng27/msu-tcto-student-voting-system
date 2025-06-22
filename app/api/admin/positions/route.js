import { connectToDB } from "@/lib/db"

export async function GET() {
    console.log("[POSITIONS] GET request received");
    try {
        console.log("[POSITIONS] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[POSITIONS] Connected to DB");
        console.log("[POSITIONS] Querying Position and PositionType tables...");
        const result = await pool.request().query(`
            SELECT 
                Position.PositionID,
                Position.Position,
                Position.PositionTypeID,
                Position.MaximumSelection,
                Position.Decree,
                PositionType.PositionType
            FROM Position
            JOIN PositionType ON Position.PositionTypeID = PositionType.PositionTypeID
        `)
        if (result.recordset && result.recordset.length > 0) {
            console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[POSITIONS] No positions found.");
            return Response.json({ message: "No positions found." }, {
                headers: { "Content-Type": "application/json" },
                status: 404
            })
        }

        console.log("[POSITIONS] Positions fetched successfully.");
        return Response.json(result.recordset, { status: 200 })
    } catch (err) {
        console.error("[POSITIONS] Error fetching positions:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}

export async function POST(request) {
    console.log("[POSITIONS] POST request received");
    try {
        const body = await request.json()
        const { name, id, type, maxSelections, orderNumber } = body
        console.log("[POSITIONS] Form data received:", { name, id, type, maxSelections, orderNumber });

        // Input validation
        if (!name || !id || !type || !maxSelections || !orderNumber) {
            console.error("[POSITIONS] Missing required fields: name, id, type, maxSelections, and/or orderNumber");
            return Response.json({
                message: "Missing required fields: name, id, type, maxSelections, and orderNumber are required."
            }, {
                status: 400
            })
        }

        console.log("[POSITIONS] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[POSITIONS] Connected to DB");

        // Find PositionTypeID based on type
        console.log("[POSITIONS] Querying PositionType for type:", type);
        const typeResult = await pool.request()
            .input('type', type)
            .query("SELECT PositionTypeID FROM PositionType WHERE PositionType = @type")
        if (typeResult.recordset && typeResult.recordset.length > 0) {
            console.table(typeResult.recordset);
        }

        if (typeResult.rowsAffected < 1) {
            console.error("[POSITIONS] Invalid position type.");
            return Response.json({
                message: "Invalid position type."
            }, {
                status: 400
            })
        }
        const positionTypeID = typeResult.recordset[0].PositionTypeID

        // Insert into Position table
        console.log("[POSITIONS] Inserting new position...");
        const result = await pool.request()
            .input('name', name)
            .input('positionTypeID', positionTypeID)
            .input('maxSelections', maxSelections)
            .input('orderNumber', orderNumber)
            .query(`
                INSERT INTO Position (Position, PositionTypeID, MaximumSelection, Decree)
                VALUES (@name, @positionTypeID, @maxSelections, @orderNumber)
            `)
        if (result.recordset && result.recordset.length > 0) {
            console.table(result.recordset);
        }

        if (result.rowsAffected < 1) {
            console.error("[POSITIONS] Failed to add position.");
            return Response.json({
                message: "Failed to add position."
            }, {
                status: 500
            })
        }

        console.log("[POSITIONS] Position added successfully.");
        return Response.json({
            message: "Position added successfully."
        }, { status: 200 })
    } catch (err) {
        console.error("[POSITIONS] Error adding position:", err.message, err);
        return Response.json({
            message: err.message
        }, {
            status: 500
        })
    }
}