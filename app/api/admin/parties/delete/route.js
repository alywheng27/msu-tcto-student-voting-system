import { connectToDB } from "@/lib/db"

export async function DELETE(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        // Input validation
        if (!form.id) {
            return Response.json({ message: "Missing required field: id is required." }, { status: 400 })
        }

        const result = await pool.request()
            .input('id', form.id)
            .query("DELETE FROM Party WHERE PartyID = @id")

        if (result.rowsAffected < 1) {
            return Response.json({ message: "Party not found or already deleted." }, { status: 404 })
        }

        return Response.json({ message: "Party deleted successfully." }, { status: 200 })
    } catch (err) {
        console.error("Error deleting party:", err.message)
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}