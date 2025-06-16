import { connectToDB } from "@/lib/db"

export async function PUT(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        const result = await pool.request()
            .input('name', form.name)
            .input('id', form.id)
            .input('color', form.color)
            .input('logo', form.logo)
            .query("UPDATE Party SET Party = @name, PartyColor = @color, Logo = @logo WHERE PartyID = @id")

        console.log("Party updated succesfully")
        return Response.json({ message: "Party updated successfully" })
    } catch (err) {
        console.error("Error updating party.", err.message)
        // Error response needs to have status
        return Response.json({ message: err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
}