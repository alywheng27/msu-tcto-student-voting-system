import { cookies } from "next/headers"

export async function getVoters() {
    try {
        const response = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/voters`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching voters:', error)
        return []
    }
}

export async function getColleges() {
    try {
        const response = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/login/college`)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.error('Error fetching colleges:', error)
        return []
    }
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