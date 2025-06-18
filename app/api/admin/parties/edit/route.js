import { connectToDB } from "@/lib/db"

export async function PUT(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        // Input validation
        if (!form.id || !form.name || !form.color) {
            return Response.json({ message: "Missing required fields: id, name, and color are required." }, { status: 400 })
        }

        const result = await pool.request()
            .input('name', form.name)
            .input('id', form.id)
            .input('color', form.color)
            .input('logo', form.logo || null)
            .query("UPDATE Party SET Party = @name, PartyColor = @color, Logo = @logo WHERE PartyID = @id")

        if (result.rowsAffected < 1) {
            return Response.json({ message: "Party not found or no changes made." }, { status: 404 })
        }

        return Response.json({ message: "Party updated successfully." }, { status: 200 })
    } catch (err) {
        console.error("Error updating party:", err.message)
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}