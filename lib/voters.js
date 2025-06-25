import { cookies } from "next/headers"

export async function getVoters() {
    const response = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/voters`)
    const data = await response.json()

    return data
}

export async function getColleges() {
    const response = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/login/college`)
    const data = await response.json()

    return data
}

export async function getCookies() {
    const cookieStore = await cookies()

    const cookieValue = {
        userID: cookieStore.get("UserID").value,
        userTypeID: cookieStore.get("UserTypeID").value,
        collegeOfficeID: cookieStore.get("CollegeOfficeID").value,
        username: cookieStore.get("Username").value,
        password: cookieStore.get("Password").value,
        firstName: cookieStore.get("FirstName").value,
        middleName: cookieStore.get("MiddleName").value,
        surname: cookieStore.get("Surname").value,
        extensionName: cookieStore.get("ExtensionName").value
    }
    
    return cookieValue
}