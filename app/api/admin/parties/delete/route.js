import { connectToDB } from "@/lib/db"

export async function DELETE(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        const result = await pool.request()
            .input('id', form.id)
            .query("DELETE FROM Party WHERE PartyID = @id")

        console.log("Party deleted succesfully")
        return Response.json({ message: "Party deleted successfully" })
    } catch (err) {
        console.error("Error deleting party.", err.message)
        // Error response needs to have status
        return Response.json({ message: err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
}