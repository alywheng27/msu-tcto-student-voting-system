export async function getParties() {
    try {
        const partiesJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/parties`)
        if (!partiesJson.ok) {
            throw new Error(`HTTP error! status: ${partiesJson.status}`)
        }
        const parties = await partiesJson.json()
        return parties
    } catch (error) {
        console.error('Error fetching parties:', error)
        return []
    }
}

export async function getCandidates() {
    try {
        const candidatesJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/candidates`)
        if (!candidatesJson.ok) {
            throw new Error(`HTTP error! status: ${candidatesJson.status}`)
        }
        const candidates = await candidatesJson.json()
        return candidates
    } catch (error) {
        console.error('Error fetching candidates:', error)
        return []
    }
}

export async function getPositions() {
    try {
        const positionsJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/positions`)
        if (!positionsJson.ok) {
            throw new Error(`HTTP error! status: ${positionsJson.status}`)
        }
        const positions = await positionsJson.json()
        return positions
    } catch (error) {
        console.error('Error fetching positions:', error)
        return []
    }
}

export async function getVotes() {
    try {
        const votesJson = await fetch(`${process.env.MSSQL_PUBLIC_APP_URL}/api/admin/results`)
        if (!votesJson.ok) {
            throw new Error(`HTTP error! status: ${votesJson.status}`)
        }
        const votes = await votesJson.json()
        return votes
    } catch (error) {
        console.error('Error fetching votes:', error)
        return { data: [] }
    }
}

export async function getElectionResults(type, college) {
  const [positions, parties, candidates, votes] = await Promise.all([getPositions(), getParties(), getCandidates(), getVotes()])

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
  
        positionCandidates.sort((a, b) => b.votes - a.votes)
        
        return {
          position: position.Position,
          positionId: position.PositionID,
          decree: position.Decree,
          candidates: positionCandidates.map((c) => ({
            id: c.CandidateID,
            firstName: c.FirstName,
            surname: c.Surname,
            party: parties.find((p) => p.PartyID === c.PartyID),
            votes: c.votes,
            photo: c.Photo,
          })),
        }
      }),
    )
  
    return results
  }

  export async function getAllVotes(filters = {}) {
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })

      const response = await fetch(`/api/admin/results?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        return result.data
      } else {
        console.error('API Error:', result.error)
        return []
      }
    } catch (error) {
      console.error('Error fetching all votes:', error)
      return []
    }
  }