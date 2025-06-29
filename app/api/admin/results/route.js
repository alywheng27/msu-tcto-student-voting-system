import { NextResponse } from "next/server"
import { connectToDB } from "@/lib/db"

export async function GET() {
  try {
    const pool = await connectToDB()

    const query = `
      SELECT 
        v.VoteID,
        v.VoterID,
        v.CandidateID,
        v.VoteTimeSubmitted,
        u.FirstName,
        u.Surname,
        c.Photo,
        p.Party,
        p.PartyColor,
        p.Logo,
        pos.Position,
        posType.PositionType,
        col.CollegeOffice,
        col.CollegeOfficeCode,
        col.CollegeOfficeColor
      FROM Vote v
      JOIN Candidate c ON v.CandidateID = c.CandidateID
      JOIN Users u ON c.UserID = u.UserID
      JOIN Party p ON c.PartyID = p.PartyID
      JOIN Position pos ON c.PositionID = pos.PositionID
      JOIN PositionType posType ON pos.PositionTypeID = posType.PositionTypeID
      JOIN CollegeOffice col ON u.CollegeOfficeID = col.CollegeOfficeID
    `

    const result = await pool.request().query(query)

    return NextResponse.json({
      success: true,
      data: result.recordset,
      total: result.recordset.length
    })

  } catch (error) {
    console.error("Error fetching votes:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch votes",
        details: error.message 
      },
      { status: 500 }
    )
  }
}
