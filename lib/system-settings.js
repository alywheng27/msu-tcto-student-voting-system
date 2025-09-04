import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

let currentSettings = {
    electionTitle: "MSU-TCTO Student Government Election 2025",
    electionDescription:
      "Annual student government election for MSU-TCTO campus representatives including Supreme Student Council and College Officers",
    votingStartDate: "2025-09-15T08:00",
    votingEndDate: "2025-09-15T19:00",
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
  
    const now = dayjs().utc()
    const startDate = dayjs(currentSettings.votingStartDate).utc()
    const endDate = dayjs(currentSettings.votingEndDate).utc()
  
    if (now.isBefore(startDate)) {
      return {
        status: "upcoming",
        message: `Voting will begin on ${startDate.format("dddd, MMMM D, YYYY [at] h:mm A")} UTC`,
      }
    }
  
    if (now.isAfter(endDate) && !currentSettings.allowLateVoting) {
      return {
        status: "ended",
        message: `Voting ended on ${endDate.format("dddd, MMMM D, YYYY [at] h:mm A")} UTC`,
      }
    }
  
    return {
      status: "active",
      message: "Voting is currently active. Cast your vote now!",
    }
  }