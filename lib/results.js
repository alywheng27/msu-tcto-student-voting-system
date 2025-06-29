export async function getParties() {
    const partiesJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/parties`)
    const parties = await partiesJson.json()

    return parties
}

export async function getCandidates() {
    const candidatesJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/candidates`)
    const candidates = await candidatesJson.json()

    return candidates
}

export async function getPositions() {
    const positionsJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/positions`)
    const positions = await positionsJson.json()

    return positions
}

export async function getVotes() {
    const votesJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/results`)
    const votes = await votesJson.json()

    return votes
}

export async function getElectionResults(type, college) {
    const positions = await getPositions()
    const parties = await getParties()
    const candidates = await getCandidates()
    const votes = await getVotes()

    const relevantPositions = positions.filter((p) => p.PositionType.toLowerCase() === type.toLowerCase())
  
    const results = await Promise.all(
      relevantPositions.map(async (position) => {
        let positionCandidates
  
        if (type === "college" && college) {
          positionCandidates = candidates.filter((c) => c.PositionID === position.PositionID && c.CollegeOfficeID === college)
        } else {
          positionCandidates = candidates.filter((c) => c.PositionID === position.PositionID)
        }

        positionCandidates = positionCandidates.map(c => ({
          ...c,
          votes: votes.data.filter((v) => v.CandidateID === c.CandidateID).length
        }));
  
        // Sort by votes in descending order
        positionCandidates.sort((a, b) => b.votes - a.votes)
        
        return {
          position: position.Position,
          positionId: position.PositionID,
          decree: position.Decree,
          candidates: positionCandidates.map((c) => ({
            id: c.CandidateID,
            name: c.Surname,
            party: parties.find((p) => p.PartyID === c.PartyID),
            votes: c.votes,
            photo: c.Photo,
          })),
        }
      }),
    )
  
    return results
  }