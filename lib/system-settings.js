let currentSettings = {
    electionTitle: "MSU-TCTO Student Government Election 2024",
    electionDescription:
      "Annual student government election for MSU-TCTO campus representatives including Supreme Student Council and College Officers",
    votingStartDate: "2024-03-15T08:00",
    votingEndDate: "2024-03-17T18:00",
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