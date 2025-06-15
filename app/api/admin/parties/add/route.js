import { connectToDB } from "@/lib/db"

export async function POST(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        const result = await pool.request()
            .input('name', form.name)
            .input('color', form.color)
            .input('logo', form.logo)
            .query("INSERT INTO Party (Party, PartyColor, Logo) VALUES (@name, @color, @logo) ")

        console.log("Party added succesfully")

        // const form = await req.json()
        // console.log(form.name)
        // console.log(form.color)
        // console.log(form.logo)
    } catch (err) {
        console.error("Error adding party.", err.message)
        // Error response needs to have status
        return Response.json({ message: err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
}