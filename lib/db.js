import sql from "mssql"

const config = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    server: process.env.MSSQL_SERVER,   // or IP/domain
    database: process.env.MSSQL_DATABASE,
    options: {
        trustedconnection: true,
        encrypt: false,
        trustServerCertificate: true,   // for local dev
    },
    // port: 1433, // default port for MSSQL
}

export async function connectToDB() {
    try {
        const pool = await sql.connect(config)
        return pool
    } catch (err) {
        console.error("Error connecting to the database", err)
        throw new Error(err)
    }
}