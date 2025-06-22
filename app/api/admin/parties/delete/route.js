import { connectToDB } from "@/lib/db"

export async function DELETE(req) {
    console.log("[PARTIES-DELETE] DELETE request received");
    try {
        console.log("[PARTIES-DELETE] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[PARTIES-DELETE] Connected to DB");
        const form = await req.json()
        console.log("[PARTIES-DELETE] Form data received:", { id: form.id });

        // Input validation
        if (!form.id) {
            console.error("[PARTIES-DELETE] Missing required field: id");
            return Response.json({ message: "Missing required field: id is required." }, { status: 400 })
        }

        console.log("[PARTIES-DELETE] Deleting party...");
        const result = await pool.request()
            .input('id', form.id)
            .query("DELETE FROM Party WHERE PartyID = @id")
        console.log("[PARTIES-DELETE] Delete result:", result);

        if (result.rowsAffected < 1) {
            console.error("[PARTIES-DELETE] Party not found or already deleted.");
            return Response.json({ message: "Party not found or already deleted." }, { status: 404 })
        }

        console.log("[PARTIES-DELETE] Party deleted successfully.");
        return Response.json({ message: "Party deleted successfully." }, { status: 200 })
    } catch (err) {
        console.error("[PARTIES-DELETE] Error deleting party:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}