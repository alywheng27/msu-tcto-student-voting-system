let currentSettings = {
    electionTitle: "MSU-TCTO Student Government Election 2025",
    electionDescription:
      "Annual student government election for MSU-TCTO campus representatives including Supreme Student Council and College Officers",
    votingStartDate: "2025-07-05T08:00",
    votingEndDate: "2025-07-05T18:00",
    votingEnabled: true,
    allowLateVoting: false,
    requireEmailVerification: true,
    auditLoggingEnabled: true,
    twoFactorRequired: false,
    maintenanceMode: false,
    autoBackup: true,
    systemMessage: "System is under maintenance. Please check back later.",
  }

  export function getElectionInfo() {
    return {
      title: currentSettings.electionTitle,
      description: currentSettings.electionDescription,
      startDate: currentSettings.votingStartDate,
      endDate: currentSettings.votingEndDate,
      systemMessage: currentSettings.systemMessage,
    }
  }

  export function getVotingStatus() {
    if (currentSettings.maintenanceMode) {
      return {
        status: "maintenance",
        message: "System is under maintenance. Voting is temporarily unavailable.",
      }
    }
  
    if (!currentSettings.votingEnabled) {
      return {
        status: "disabled",
        message: "Voting is currently disabled by administrators.",
      }
    }
  
    const now = new Date()
    const startDate = new Date(currentSettings.votingStartDate)
    const endDate = new Date(currentSettings.votingEndDate)
  
    if (now < startDate) {
      return {
        status: "upcoming",
        message: `Voting will begin on ${startDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      }
    }
  
    if (now > endDate && !currentSettings.allowLateVoting) {
      return {
        status: "ended",
        message: `Voting ended on ${endDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`,
      }
    }
  
    return {
      status: "active",
      message: "Voting is currently active. Cast your vote now!",
    }
  }