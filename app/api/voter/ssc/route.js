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
            const { president, vicePresident, senators } = selections;
            const voterId = cookieStore.get('UserID').value

            const dateNow = new Date().toISOString()

            const pool = await connectToDB();
            // Insert vote for president if selected
            if (president) {
                await pool.request()
                    .input('voterId', voterId)
                    .input('candidateId', president)
                    .input('voteTimeSubmitted', dateNow)
                    .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
            }
            // Insert vote for vice president if selected
            if (vicePresident) {
                await pool.request()
                    .input('voterId', voterId)
                    .input('candidateId', vicePresident)
                    .input('voteTimeSubmitted', dateNow)
                    .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
            }
            // Insert votes for senators
            if (Array.isArray(senators)) {
                for (const senatorId of senators) {
                    await pool.request()
                        .input('voterId', voterId)
                        .input('candidateId', senatorId)
                        .input('voteTimeSubmitted', dateNow)
                        .query(`INSERT INTO Vote (VoterID, CandidateID, VoteTimeSubmitted) VALUES (@voterId, @candidateId, @voteTimeSubmitted)`);
                }
            }

            await pool.request()
                .input('voterId', voterId)
                .query(`UPDATE Voter SET HasVotedSSC = 'True' WHERE UserID = @voterId`);

            return Response.json({ message: 'Vote submitted successfully.' }, { status: 200 });
        } catch (err) {
            console.error('[VOTE] Error submitting vote:', err.message, err);
            return Response.json({ message: err.message }, { status: 500 });
        }
    }

} 