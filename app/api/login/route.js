import { connectToDB } from "@/lib/db";
import { cookies } from "next/headers"

export async function POST(req) {
    try {
        const pool = await connectToDB()
        const form = await req.json()

        console.log("Attempting login with:", "Username: ", form.username, "Password: ", form.password, "Role: ", form.role, "College: ", form.college )

        const result = await pool.request()
            .input('username', form.username)
            .input('password', form.password)
            .query("SELECT * FROM Users WHERE username = @username AND password = @password")

        if(result.rowsAffected < 1 
            || result.recordset[0].UserTypeID == 1 && form.role == 'voter' 
            || result.recordset[0].UserTypeID == 2 && form.role == 'admin' ){
            console.log("User not found. Login failed.")
            // Error response needs to have status
            return Response.json({ message: "Invalid credentials. Please check your username, password, and selected college.",  }, { 
                headers: {
                    "Content-Type": "application/json",
                },
                status: 401 
            })
        }

        const cookieStore = await cookies()

        cookieStore.set("UserID", result.recordset[0].UserID)
        cookieStore.set("UserTypeID", result.recordset[0].UserTypeID)
        cookieStore.set("CollegeOfficeID", result.recordset[0].CollegeOfficeID)
        cookieStore.set("Username", result.recordset[0].Username)
        cookieStore.set("Password", result.recordset[0].Password)
        cookieStore.set("FirstName", result.recordset[0].FirstName)
        cookieStore.set("MiddleName", result.recordset[0].MiddleName)
        cookieStore.set("Surname", result.recordset[0].Surname)
        cookieStore.set("ExtensionName", result.recordset[0].ExtensionName)

        console.log(form.username + " login successfully")
        return Response.json(result.recordset)
    } catch (err) {
        console.error("Error fetching user.", err.message)
        // Error response needs to have status
        return Response.json({ message: err.message,  }, { 
            headers: {
                "Content-Type": "application/json",
            },
            status: 500 
        })
    }
    
}