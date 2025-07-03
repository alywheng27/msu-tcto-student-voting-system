import { getPositions, getParties, getCandidates, getVotes } from "./results";
import { getVoters, getColleges } from "./voters";

// Get party results
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
                // Combine both SSC and College candidates for this party
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

    // Sort by votes in descending order
    partyResults.sort((a, b) => b.votes - a.votes);

    return partyResults;
}

// Mock voting statistics
export async function getVotingStats() {
    // Fetch real data
    const [voters, colleges] = await Promise.all([getVoters(), getColleges()]);

    // Total students = all voters (students with a Voter entry)
    const totalStudents = voters.length;
    // Total voters = students who have voted in either SSC or College
    const totalVoters = voters.filter(
        (v) => v.HasVotedSSC === true || v.HasVotedCollege === true
    ).length;

    // College breakdown
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
}
