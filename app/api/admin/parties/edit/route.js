import { connectToDB } from "@/lib/db"

export async function PUT(req) {
    console.log("[PARTIES-EDIT] PUT request received");
    try {
        console.log("[PARTIES-EDIT] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[PARTIES-EDIT] Connected to DB");
        const form = await req.json()
        console.log("[PARTIES-EDIT] Form data received:", { id: form.id, name: form.name, color: form.color, logo: form.logo });

        // Input validation
        if (!form.id || !form.name || !form.color) {
            console.error("[PARTIES-EDIT] Missing required fields: id, name, and/or color");
            return Response.json({ message: "Missing required fields: id, name, and color are required." }, { status: 400 })
        }

        console.log("[PARTIES-EDIT] Updating party...");
        const result = await pool.request()
            .input('name', form.name)
            .input('id', form.id)
            .input('color', form.color)
            .input('logo', form.logo || null)
            .query("UPDATE Party SET Party = @name, PartyColor = @color, Logo = @logo WHERE PartyID = @id")
        console.log("[PARTIES-EDIT] Update result:", result);

        if (result.rowsAffected < 1) {
            console.error("[PARTIES-EDIT] Party not found or no changes made.");
            return Response.json({ message: "Party not found or no changes made." }, { status: 404 })
        }

        console.log("[PARTIES-EDIT] Party updated successfully.");
        return Response.json({ message: "Party updated successfully." }, { status: 200 })
    } catch (err) {
        console.error("[PARTIES-EDIT] Error updating party:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}