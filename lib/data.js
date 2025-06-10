// "use server"

// This file contains mock data for the application
// In a real application, this would be replaced with database calls

// Mock users
export const users = [
  {
    id: "1",
    name: "Admin User",
    username: "admin",
    role: "admin",
  },
  {
    id: "2",
    name: "John Doe",
    username: "john",
    role: "voter",
    college: "cas",
    hasVoted: {
      ssc: false,
      college: false,
    },
  },
  {
    id: "3",
    name: "Jane Smith",
    username: "jane",
    role: "voter",
    college: "coe",
    hasVoted: {
      ssc: false,
      college: false,
    },
  },
  {
    id: "4",
    name: "Bob Johnson",
    username: "bob",
    role: "voter",
    college: "cias",
    hasVoted: {
      ssc: true,
      college: false,
    },
  },
  {
    id: "5",
    name: "Alice Brown",
    username: "alice",
    role: "voter",
    college: "iict",
    hasVoted: {
      ssc: true,
      college: true,
    },
  },
]

// Mock colleges
export const colleges = [
  {
    id: "cas",
    name: "College of Arts and Sciences",
    shortName: "CAS",
    color: "#4CAF50",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Fostering critical thinking and scientific inquiry",
  },
  {
    id: "coe",
    name: "College of Education",
    shortName: "COE",
    color: "#2196F3",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Shaping future educators and leaders",
  },
  {
    id: "cias",
    name: "College of Islamic and Arabic Studies",
    shortName: "CIAS",
    color: "#9C27B0",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Preserving Islamic heritage and knowledge",
  },
  {
    id: "iict",
    name: "Institute of Information and Communications Technology",
    shortName: "IICT",
    color: "#FF9800",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Advancing technology and innovation",
  },
  {
    id: "ies",
    name: "Institute of Environmental Sciences",
    shortName: "IES",
    color: "#795548",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Protecting our environment for future generations",
  },
  {
    id: "cof",
    name: "College of Fisheries",
    shortName: "COF",
    color: "#00BCD4",
    logo: "/placeholder.svg?height=80&width=80",
    description: "Sustainable marine resource management",
  },
]

// Mock parties
export const parties = [
  {
    id: "unity",
    name: "Unity Party",
    logo: "/placeholder.svg?height=100&width=100",
    color: "#2196F3",
  },
  {
    id: "progress",
    name: "Progress Party",
    logo: "/placeholder.svg?height=100&width=100",
    color: "#4CAF50",
  },
  {
    id: "reform",
    name: "Reform Party",
    logo: "/placeholder.svg?height=100&width=100",
    color: "#FF9800",
  },
]

// Mock positions
export const positions = [
  {
    id: "president",
    name: "President",
    type: "ssc",
    maxSelections: 1,
    description: "Leads the Supreme Student Council and represents all students in university matters.",
    requirements: "Must be a full-time student with good academic standing and leadership experience.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "vice-president",
    name: "Vice President",
    type: "ssc",
    maxSelections: 1,
    description: "Assists the President and assumes presidential duties when necessary.",
    requirements: "Must be a full-time student with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "senator",
    name: "Senator",
    type: "ssc",
    maxSelections: 10,
    description: "Represents student interests and participates in legislative functions of the SSC.",
    requirements: "Must be a full-time student with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "governor",
    name: "Governor",
    type: "college",
    maxSelections: 1,
    description: "Leads the college student government and represents college interests.",
    requirements: "Must be a student of the respective college with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "vice-governor",
    name: "Vice Governor",
    type: "college",
    maxSelections: 1,
    description: "Assists the Governor and assumes gubernatorial duties when necessary.",
    requirements: "Must be a student of the respective college with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "mayor",
    name: "Mayor",
    type: "college",
    maxSelections: 1,
    description: "Manages college-level programs and student activities.",
    requirements: "Must be a student of the respective college with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "vice-mayor",
    name: "Vice Mayor",
    type: "college",
    maxSelections: 1,
    description: "Assists the Mayor in managing college programs and activities.",
    requirements: "Must be a student of the respective college with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
  {
    id: "board-member",
    name: "Board Member",
    type: "college",
    maxSelections: 6,
    description: "Participates in college governance and represents student interests in college matters.",
    requirements: "Must be a student of the respective college with good academic standing.",
    isActive: true,
    allowSkip: true,
  },
]

// Mock candidates
export const candidates = [
  // SSC Candidates - President
  {
    id: "1",
    name: "Ahmad Khan",
    position: "president",
    party: "unity",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 120,
  },
  {
    id: "2",
    name: "Maria Santos",
    position: "president",
    party: "progress",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 105,
  },
  {
    id: "3",
    name: "Ibrahim Ali",
    position: "president",
    party: "reform",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 95,
  },

  // SSC Candidates - Vice President
  {
    id: "4",
    name: "Fatima Hassan",
    position: "vice-president",
    party: "unity",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 110,
  },
  {
    id: "5",
    name: "Carlos Rodriguez",
    position: "vice-president",
    party: "progress",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 100,
  },
  {
    id: "6",
    name: "Aisha Mohammed",
    position: "vice-president",
    party: "reform",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 90,
  },

  // SSC Candidates - Senators (just a few examples)
  {
    id: "7",
    name: "Omar Abdullah",
    position: "senator",
    party: "unity",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 85,
  },
  {
    id: "8",
    name: "Sofia Garcia",
    position: "senator",
    party: "unity",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 80,
  },
  {
    id: "9",
    name: "Jamal Hussein",
    position: "senator",
    party: "progress",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 75,
  },
  {
    id: "10",
    name: "Leila Mahmoud",
    position: "senator",
    party: "progress",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 70,
  },
  {
    id: "11",
    name: "Rashid Khan",
    position: "senator",
    party: "reform",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 65,
  },
  {
    id: "12",
    name: "Nadia Ahmed",
    position: "senator",
    party: "reform",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 60,
  },

  // College of Arts and Sciences (CAS) - Governor
  {
    id: "13",
    name: "Hamza Ali",
    position: "governor",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 45,
  },
  {
    id: "14",
    name: "Layla Ibrahim",
    position: "governor",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 40,
  },

  // CAS - Vice Governor
  {
    id: "cas_vg1",
    name: "Zara Khan",
    position: "vice-governor",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 42,
  },
  {
    id: "cas_vg2",
    name: "Ahmed Hassan",
    position: "vice-governor",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 38,
  },

  // CAS - Mayor
  {
    id: "cas_m1",
    name: "Malik Raza",
    position: "mayor",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 41,
  },
  {
    id: "cas_m2",
    name: "Nadia Patel",
    position: "mayor",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 39,
  },

  // CAS - Vice Mayor
  {
    id: "cas_vm1",
    name: "Sana Ahmed",
    position: "vice-mayor",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 43,
  },
  {
    id: "cas_vm2",
    name: "Omar Farooq",
    position: "vice-mayor",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 37,
  },

  // CAS - Board Members
  {
    id: "cas_bm1",
    name: "Aisha Malik",
    position: "board-member",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 35,
  },
  {
    id: "cas_bm2",
    name: "Yusuf Khan",
    position: "board-member",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 33,
  },
  {
    id: "cas_bm3",
    name: "Fatima Ali",
    position: "board-member",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 32,
  },
  {
    id: "cas_bm4",
    name: "Ibrahim Hassan",
    position: "board-member",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 30,
  },
  {
    id: "cas_bm5",
    name: "Zainab Shah",
    position: "board-member",
    party: "reform",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 28,
  },
  {
    id: "cas_bm6",
    name: "Khalid Ahmed",
    position: "board-member",
    party: "reform",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 26,
  },
  {
    id: "cas_bm7",
    name: "Mariam Raza",
    position: "board-member",
    party: "unity",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 25,
  },
  {
    id: "cas_bm8",
    name: "Hassan Ali",
    position: "board-member",
    party: "progress",
    college: "cas",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 24,
  },

  // College of Education (COE) candidates
  {
    id: "coe_g1",
    name: "Zainab Hassan",
    position: "governor",
    party: "unity",
    college: "coe",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 35,
  },
  {
    id: "coe_g2",
    name: "Yusuf Mohammed",
    position: "governor",
    party: "progress",
    college: "coe",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 30,
  },
  {
    id: "coe_vg1",
    name: "Amina Khalil",
    position: "vice-governor",
    party: "unity",
    college: "coe",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 32,
  },
  {
    id: "coe_vg2",
    name: "Tariq Rahman",
    position: "vice-governor",
    party: "progress",
    college: "coe",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 28,
  },
  {
    id: "coe_m1",
    name: "Khadija Noor",
    position: "mayor",
    party: "unity",
    college: "coe",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 31,
  },
  {
    id: "coe_m2",
    name: "Bilal Ahmed",
    position: "mayor",
    party: "progress",
    college: "coe",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 29,
  },

  // Add similar candidates for other colleges (CIAS, IICT, IES, COF)
  // CIAS candidates
  {
    id: "cias_g1",
    name: "Abdullah Rashid",
    position: "governor",
    party: "unity",
    college: "cias",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 28,
  },
  {
    id: "cias_g2",
    name: "Maryam Saleh",
    position: "governor",
    party: "progress",
    college: "cias",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 25,
  },

  // IICT candidates
  {
    id: "iict_g1",
    name: "Fahad Khan",
    position: "governor",
    party: "unity",
    college: "iict",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 40,
  },
  {
    id: "iict_g2",
    name: "Ayesha Malik",
    position: "governor",
    party: "progress",
    college: "iict",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 38,
  },

  // IES candidates
  {
    id: "ies_g1",
    name: "Saeed Ibrahim",
    position: "governor",
    party: "unity",
    college: "ies",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 22,
  },
  {
    id: "ies_g2",
    name: "Rabia Hassan",
    position: "governor",
    party: "progress",
    college: "ies",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 20,
  },

  // COF candidates
  {
    id: "cof_g1",
    name: "Nasir Ali",
    position: "governor",
    party: "unity",
    college: "cof",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 18,
  },
  {
    id: "cof_g2",
    name: "Samira Khan",
    position: "governor",
    party: "progress",
    college: "cof",
    photo: "/placeholder.svg?height=200&width=200",
    votes: 16,
  },
]

// Mock voting statistics
export async function getVotingStats() {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const totalStudents = 1200
      const totalVoters = 750

      const collegeStats = colleges.map((college) => {
        const totalStudentsInCollege = Math.floor(Math.random() * 300) + 100
        const votersCount = Math.floor(Math.random() * totalStudentsInCollege)

        return {
          name: college.shortName,
          totalStudents: totalStudentsInCollege,
          votersCount: votersCount,
        }
      })

      resolve({
        totalStudents,
        totalVoters,
        collegeStats,
      })
    }, 5000)

    // Cleanup function
    return () => clearInterval(interval)
  })
}

// Get candidates by position
export async function getCandidatesByPosition(position, college) {
  if (positions.find((p) => p.type === "college" && p.id === position)) {
    return candidates.filter((c) => c.position === position && c.college === college)
  }

  return candidates.filter((c) => c.position === position)
}

// Get candidates by party
export async function getCandidatesByParty(party, type, college) {
  if (type === "ssc") {
    return candidates.filter((c) => {
      const position = positions.find((p) => p.id === c.position)
      return c.party === party && position?.type === "ssc"
    })
  } else {
    return candidates.filter((c) => {
      const position = positions.find((p) => p.id === c.position)
      return c.party === party && position?.type === "college" && c.college === college
    })
  }
}

// Submit votes
export async function submitVotes(userId, votes, type) {
  // In a real app, this would update a database
  // For demo purposes, we'll just update our mock data

  const user = users.find((u) => u.id === userId)
  if (!user || !user.hasVoted) return false

  // Mark user as having voted
  if (type === "ssc") {
    user.hasVoted.ssc = true
  } else {
    user.hasVoted.college = true
  }

  // Update vote counts for candidates
  votes.forEach((vote) => {
    const candidate = candidates.find((c) => c.id === vote.candidateId)
    if (candidate) {
      candidate.votes += 1
    }
  })

  return true
}

// Get election results
export async function getElectionResults(type, college) {
  const relevantPositions = positions.filter((p) => p.type === type)

  const results = await Promise.all(
    relevantPositions.map(async (position) => {
      let positionCandidates

      if (type === "college" && college) {
        positionCandidates = candidates.filter((c) => c.position === position.id && c.college === college)
      } else {
        positionCandidates = candidates.filter((c) => c.position === position.id)
      }

      // Sort by votes in descending order
      positionCandidates.sort((a, b) => b.votes - a.votes)

      return {
        position: position.name,
        positionId: position.id,
        candidates: positionCandidates.map((c) => ({
          id: c.id,
          name: c.name,
          party: parties.find((p) => p.id === c.party)?.name || c.party,
          votes: c.votes,
          photo: c.photo,
        })),
      }
    }),
  )

  return results
}

// Get party results
export async function getPartyResults(type, college) {
  const partyResults = await Promise.all(
    parties.map(async (party) => {
      let partyVotes = 0
      let partyCandidates

      if (type === "college" && college) {
        partyCandidates = candidates.filter((c) => {
          const position = positions.find((p) => p.id === c.position)
          return c.party === party.id && position?.type === type && c.college === college
        })
      } else {
        partyCandidates = candidates.filter((c) => {
          const position = positions.find((p) => p.id === c.position)
          return c.party === party.id && position?.type === type
        })
      }

      partyVotes = partyCandidates.reduce((sum, candidate) => sum + candidate.votes, 0)

      return {
        party: party.name,
        partyId: party.id,
        color: party.color,
        votes: partyVotes,
        candidates: partyCandidates.length,
      }
    }),
  )

  // Sort by votes in descending order
  partyResults.sort((a, b) => b.votes - a.votes)

  return partyResults
}
