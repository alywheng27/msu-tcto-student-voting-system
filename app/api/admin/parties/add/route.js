import { connectToDB } from "@/lib/db"

export async function POST(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        // Input validation
        if (!form.name || !form.color) {
            return Response.json({ message: "Missing required fields: name and color are required." }, { status: 400 })
        }

        const result = await pool.request()
            .input('name', form.name)
            .input('color', form.color)
            .input('logo', form.logo || null)
            .query("INSERT INTO Party (Party, PartyColor, Logo) VALUES (@name, @color, @logo)")

        if (result.rowsAffected < 1) {
            return Response.json({ message: "Failed to add party." }, { status: 500 })
        }

        return Response.json({ message: "Party added successfully." }, { status: 200 })
    } catch (err) {
        console.error("Error adding party:", err.message)
        return Response.json({ message: err.message }, {
            headers: { "Content-Type": "application/json" },
            status: 500
        })
    }
}