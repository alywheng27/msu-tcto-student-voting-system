export default function VoterLayout({ children, voterInformation, electionStatus, voting, importantReminders }) {

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Voter Dashboard</h1>
        <p className="text-gray-600">Welcome to the MSU-TCTO Election Portal</p>
      </div>

      {/* Voter Information */}
      {voterInformation}

      {/* Election Status */}
      {electionStatus}

      {/* Voting Sections */}
      {voting}

      {/* Important Reminders */}
      {importantReminders}
    </div>
  )
}
