import { connectToDB } from "@/lib/db"

export async function POST(req) {
    console.log("[PARTIES-ADD] POST request received");
    try {
        console.log("[PARTIES-ADD] Connecting to DB...");
        const pool = await connectToDB()
        console.log("[PARTIES-ADD] Connected to DB");
        const form = await req.json()
        console.log("[PARTIES-ADD] Form data received:", { name: form.name, color: form.color, logo: form.logo });

        // Input validation
        if (!form.name || !form.color) {
            console.error("[PARTIES-ADD] Missing required fields: name and/or color");
            return Response.json({ message: "Missing required fields: name and color are required." }, { status: 400 })
        }

        console.log("[PARTIES-ADD] Inserting new party...");
        const result = await pool.request()
            .input('name', form.name)
            .input('color', form.color)
            .input('logo', form.logo || null)
            .query("INSERT INTO Party (Party, PartyColor, Logo) VALUES (@name, @color, @logo)")
        console.log("[PARTIES-ADD] Insert result:", result);

        if (result.rowsAffected < 1) {
            console.error("[PARTIES-ADD] Failed to add party.");
            return Response.json({ message: "Failed to add party." }, { status: 500 })
        }

        console.log("[PARTIES-ADD] Party added successfully.");
        return Response.json({ message: "Party added successfully." }, { status: 200 })
    } catch (err) {
        console.error("[PARTIES-ADD] Error adding party:", err.message, err);
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}