import { connectToDB } from "@/lib/db"
import { cookies } from "next/headers"

export async function GET() {
    
}

export async function POST(request) {
    const body = await request.json();
    const cookieStore = await cookies()
    // If the request is for vote submission
    if (body.selections) {
        // --- VOTE SUBMISSION LOGIC ---
        try {
            const { selections } = body;
            const { governor, viceGovernor, mayor, viceMayor, boardMembers } = selections;
            const voterId = cookieStore.get('UserID').value

            const dateNow = new Date().toISOString()

            const pool = await connectToDB();
            // Insert vote for governor if selected
            if (governor) {
                await pool.request()
                    .input('voterId', voterId)
                    .input('candidateId', governor)
                    .input('voteTimeSubmitted', dateNow)
                    .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
            }
            // Insert vote for vice governor if selected
            if (viceGovernor) {
                await pool.request()
                    .input('voterId', voterId)
                    .input('candidateId', viceGovernor)
                    .input('voteTimeSubmitted', dateNow)
                    .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
            }
            // Insert vote for mayor if selected
            if (mayor) {
                await pool.request()
                    .input('voterId', voterId)
                    .input('candidateId', mayor)
                    .input('voteTimeSubmitted', dateNow)
                    .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
            }
            // Insert vote for vice mayor if selected
            if (viceMayor) {
                await pool.request()
                    .input('voterId', voterId)
                    .input('candidateId', viceMayor)
                    .input('voteTimeSubmitted', dateNow)
                    .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
            }
            // Insert votes for board members
            if (Array.isArray(boardMembers)) {
                for (const bmId of boardMembers) {
                    await pool.request()
                        .input('voterId', voterId)
                        .input('candidateId', bmId)
                        .input('voteTimeSubmitted', dateNow)
                        .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
                }
            }

            await pool.request()
                .input('voterId', voterId)
                .query(`UPDATE Voter SET HasVotedCollege = 'True' WHERE UserID = @voterId`);

            return Response.json({ message: 'Vote submitted successfully.' }, { status: 200 });
        } catch (err) {
            console.error('[VOTE] Error submitting vote:', err.message, err);
            return Response.json({ message: err.message }, { status: 500 });
        }
    }

} 