import { getPositions, getParties, getCandidates, getVotes } from "./results";
import { getVoters, getColleges } from "./voters";

export async function getPartyResults(type, college) {
    const [positions, parties, candidates, votes] = await Promise.all([
        getPositions(),
        getParties(),
        getCandidates(),
        getVotes(),
    ]);

    const partyResults = await Promise.all(
        parties.map(async (party) => {
            let partyVotes = 0;
            let partyCandidates;

            if (type === "all") {
                partyCandidates = candidates.filter((c) => c.PartyID === party.PartyID);
                if (college) {
                    partyCandidates = partyCandidates.filter(
                        (c) => c.CollegeOffice && c.CollegeOffice.toLowerCase() === college
                    );
                }
            } else if (type === "college" && college) {
                partyCandidates = candidates.filter((c) => {
                    const position = positions.find((p) => p.PositionID === c.PositionID);
                    return (
                        c.PartyID === party.PartyID &&
                        position?.PositionType.toLowerCase() === type &&
                        c.CollegeOffice.toLowerCase() === college
                    );
                });
            } else {
                partyCandidates = candidates.filter((c) => {
                    const position = positions.find((p) => p.PositionID === c.PositionID);
                    return (
                        c.PartyID === party.PartyID &&
                        position?.PositionType.toLowerCase() === type
                    );
                });
            }

            partyVotes = partyCandidates.reduce((sum, candidate) => {
                const candidateVotes = votes.data.filter(
                    (v) => v.CandidateID == candidate.CandidateID
                );
                return sum + candidateVotes.length;
            }, 0);

            return {
                party: party.Party,
                partyId: party.PartyID,
                color: party.Color,
                votes: partyVotes,
                candidates: partyCandidates.length,
            };
        })
    );

    partyResults.sort((a, b) => b.votes - a.votes);

    return partyResults;
}

export async function getVotingStats() {
    try {
        const [voters, colleges] = await Promise.all([getVoters(), getColleges()]);

        const totalStudents = voters.length;
        const totalVoters = voters.filter(
            (v) => v.HasVotedSSC === true || v.HasVotedCollege === true
        ).length;

        const collegeStats = colleges.map((college) => {
            const studentsInCollege = voters.filter(
                (v) => v.CollegeOffice === college.CollegeOffice
            );
            const votersInCollege = studentsInCollege.filter(
                (v) => v.HasVotedSSC === true || v.HasVotedCollege === true
            );
            return {
                name: college.CollegeOfficeCode || college.CollegeOffice,
                totalStudents: studentsInCollege.length,
                votersCount: votersInCollege.length,
            };
        });

        return {
            totalStudents,
            totalVoters,
            collegeStats,
        };
    } catch (error) {
        console.error('Error getting voting stats:', error)
        return {
            totalStudents: 0,
            totalVoters: 0,
            collegeStats: [],
        };
    }
}
