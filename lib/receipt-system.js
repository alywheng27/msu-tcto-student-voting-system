// "use server"

import crypto from "crypto"

// Secret key for digital signatures
const SIGNATURE_SECRET = process.env.RECEIPT_SIGNATURE_SECRET || "msu-tcto-voting-system-secret-key-2024"

// Global sequence counter (in production, this would be stored in a database)
let globalSequenceCounter = 1000

// Generate a simple mathematical checksum of vote data (no cryptographic hashing)
function generateVoteChecksum(selections, timestamp, sequenceNumber) {
  let checksum = 0

  // Add character codes from position and candidate names
  selections.forEach((selection, index) => {
    const positionSum = selection.positionName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const candidateSum = selection.candidateName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
    const partySum = selection.partyName.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)

    checksum += positionSum * (index + 1) + candidateSum * (index + 2) + partySum * (index + 3)
  })

  // Add timestamp components
  const timestampSum = new Date(timestamp).getTime() % 100000
  checksum += timestampSum

  // Add sequence number
  checksum += sequenceNumber * 7

  // Convert to a readable format
  return (checksum % 999999).toString().padStart(6, "0")
}

// Generate integrity markers using mathematical patterns
function generateIntegrityMarkers(selections, receiptId) {
  const markers = []

  // Marker 1: Sum of all character positions
  let positionSum = 0
  selections.forEach((selection) => {
    positionSum += selection.positionName.length + selection.candidateName.length + selection.partyName.length
  })
  markers.push(`POS-${(positionSum * 13) % 9999}`)

  // Marker 2: Receipt ID pattern validation
  const idPattern = receiptId.split("-").reduce((sum, part) => {
    return sum + part.split("").reduce((partSum, char) => partSum + char.charCodeAt(0), 0)
  }, 0)
  markers.push(`ID-${(idPattern * 17) % 9999}`)

  // Marker 3: Selection count and order validation
  const selectionPattern =
    selections.length * 23 +
    selections.reduce((sum, sel, idx) => {
      return sum + sel.candidateName.charCodeAt(0) * (idx + 1)
    }, 0)
  markers.push(`SEL-${selectionPattern % 9999}`)

  return markers
}

// Generate a digital signature for the receipt (using HMAC but not for vote data hashing)
function generateDigitalSignature(receiptData) {
  return crypto.createHmac("sha256", SIGNATURE_SECRET).update(receiptData).digest("hex")
}

// Generate a random receipt ID that cannot be traced back to the voter
function generateReceiptId() {
  const timestamp = Date.now().toString(36)
  const random = crypto.randomBytes(8).toString("hex")
  return `MSU-${timestamp}-${random}`.toUpperCase()
}

// Generate a verification code using mathematical validation
function generateVerificationCode(receiptId, voteChecksum, sequenceNumber) {
  // Use mathematical operations instead of hashing
  const idSum = receiptId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)
  const checksumNum = Number.parseInt(voteChecksum)
  const combined = (idSum * 31 + checksumNum * 37 + sequenceNumber * 41) % 999999

  return combined.toString().padStart(6, "0").toUpperCase()
}

// Validate receipt structure and mathematical integrity
function validateReceiptStructure(receipt) {
  // Check required fields
  if (
    !receipt.receiptId ||
    !receipt.timestamp ||
    !receipt.voteChecksum ||
    !receipt.verificationCode ||
    !receipt.selections ||
    !receipt.integrityMarkers
  ) {
    return false
  }

  // Validate receipt ID format
  if (!receipt.receiptId.match(/^MSU-[A-Z0-9]+-[A-F0-9]+$/)) {
    return false
  }

  // Validate timestamp
  const timestamp = new Date(receipt.timestamp)
  if (isNaN(timestamp.getTime())) {
    return false
  }

  // Validate selections structure
  if (!Array.isArray(receipt.selections) || receipt.selections.length === 0) {
    return false
  }

  // Validate integrity markers format
  if (!Array.isArray(receipt.integrityMarkers) || receipt.integrityMarkers.length !== 3) {
    return false
  }

  return true
}

// Main function to generate an untraceable receipt
export async function generateVoteReceipt(
  selections,
  electionType,
  college,
) {
  const timestamp = new Date().toISOString()
  const receiptId = generateReceiptId()
  const sequenceNumber = globalSequenceCounter++

  const voteChecksum = generateVoteChecksum(selections, timestamp, sequenceNumber)
  const verificationCode = generateVerificationCode(receiptId, voteChecksum, sequenceNumber)
  const integrityMarkers = generateIntegrityMarkers(selections, receiptId)

  // Create receipt data for signature (without hashing the vote content)
  const receiptData = JSON.stringify({
    receiptId,
    timestamp,
    electionType,
    college,
    sequenceNumber,
    selectionsCount: selections.length,
  })

  const digitalSignature = generateDigitalSignature(receiptData)

  return {
    receiptId,
    timestamp,
    electionType,
    college,
    voteChecksum,
    digitalSignature,
    selections,
    verificationCode,
    sequenceNumber,
    integrityMarkers,
  }
}

// Verify receipt authenticity using mathematical validation
export async function verifyReceipt(receipt) {
  try {
    // Step 1: Validate receipt structure
    if (!validateReceiptStructure(receipt)) {
      console.log("Receipt structure validation failed")
      return false
    }

    // Step 2: Verify vote checksum
    const expectedChecksum = generateVoteChecksum(receipt.selections, receipt.timestamp, receipt.sequenceNumber)
    if (receipt.voteChecksum !== expectedChecksum) {
      console.log("Vote checksum validation failed")
      return false
    }

    // Step 3: Verify verification code
    const expectedVerificationCode = generateVerificationCode(
      receipt.receiptId,
      receipt.voteChecksum,
      receipt.sequenceNumber,
    )
    if (receipt.verificationCode !== expectedVerificationCode) {
      console.log("Verification code validation failed")
      return false
    }

    // Step 4: Verify integrity markers
    const expectedMarkers = generateIntegrityMarkers(receipt.selections, receipt.receiptId)
    if (receipt.integrityMarkers.length !== expectedMarkers.length) {
      console.log("Integrity markers count validation failed")
      return false
    }

    for (let i = 0; i < expectedMarkers.length; i++) {
      if (receipt.integrityMarkers[i] !== expectedMarkers[i]) {
        console.log(`Integrity marker ${i} validation failed`)
        return false
      }
    }

    // Step 5: Verify digital signature
    const receiptData = JSON.stringify({
      receiptId: receipt.receiptId,
      timestamp: receipt.timestamp,
      electionType: receipt.electionType,
      college: receipt.college,
      sequenceNumber: receipt.sequenceNumber,
      selectionsCount: receipt.selections.length,
    })

    const expectedSignature = generateDigitalSignature(receiptData)
    if (receipt.digitalSignature !== expectedSignature) {
      console.log("Digital signature validation failed")
      return false
    }

    // Step 6: Validate timestamp reasonableness
    const receiptTime = new Date(receipt.timestamp).getTime()
    const now = Date.now()
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000
    const oneHourFromNow = now + 60 * 60 * 1000

    if (receiptTime < oneYearAgo || receiptTime > oneHourFromNow) {
      console.log("Timestamp validation failed")
      return false
    }

    // Step 7: Validate selection data integrity
    for (const selection of receipt.selections) {
      if (
        !selection.positionId ||
        !selection.positionName ||
        !selection.candidateId ||
        !selection.candidateName ||
        !selection.partyName
      ) {
        console.log("Selection data validation failed")
        return false
      }
    }

    return true
  } catch (error) {
    console.error("Receipt verification error:", error)
    return false
  }
}

// Store receipt information for verification (without voter identity)

export async function registerReceipt(receiptId, voteChecksum, sequenceNumber) {
  receiptRegistry.set(receiptId, {
    checksum: voteChecksum,
    timestamp: new Date().toISOString(),
    sequenceNumber,
    verified: true,
  })
}

export async function checkReceiptExists(receiptId) {
  return receiptRegistry.has(receiptId)
}

// Additional validation function for cross-checking
export async function validateReceiptIntegrity(receipt) {
  const details = {
    structureValid: false,
    checksumValid: false,
    verificationCodeValid: false,
    integrityMarkersValid: false,
    signatureValid: false,
    timestampValid: false,
    selectionsValid: false,
  }

  try {
    // Structure validation
    details.structureValid = validateReceiptStructure(receipt)

    // Checksum validation
    const expectedChecksum = generateVoteChecksum(receipt.selections, receipt.timestamp, receipt.sequenceNumber)
    details.checksumValid = receipt.voteChecksum === expectedChecksum

    // Verification code validation
    const expectedVerificationCode = generateVerificationCode(
      receipt.receiptId,
      receipt.voteChecksum,
      receipt.sequenceNumber,
    )
    details.verificationCodeValid = receipt.verificationCode === expectedVerificationCode

    // Integrity markers validation
    const expectedMarkers = generateIntegrityMarkers(receipt.selections, receipt.receiptId)
    details.integrityMarkersValid =
      receipt.integrityMarkers.length === expectedMarkers.length &&
      receipt.integrityMarkers.every((marker, index) => marker === expectedMarkers[index])

    // Digital signature validation
    const receiptData = JSON.stringify({
      receiptId: receipt.receiptId,
      timestamp: receipt.timestamp,
      electionType: receipt.electionType,
      college: receipt.college,
      sequenceNumber: receipt.sequenceNumber,
      selectionsCount: receipt.selections.length,
    })
    const expectedSignature = generateDigitalSignature(receiptData)
    details.signatureValid = receipt.digitalSignature === expectedSignature

    // Timestamp validation
    const receiptTime = new Date(receipt.timestamp).getTime()
    const now = Date.now()
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000
    const oneHourFromNow = now + 60 * 60 * 1000
    details.timestampValid = receiptTime >= oneYearAgo && receiptTime <= oneHourFromNow

    // Selections validation
    details.selectionsValid = receipt.selections.every(
      (selection) =>
        selection.positionId &&
        selection.positionName &&
        selection.candidateId &&
        selection.candidateName &&
        selection.partyName,
    )

    const isValid = Object.values(details).every((valid) => valid)

    return { isValid, validationDetails: details }
  } catch (error) {
    console.error("Receipt integrity validation error:", error)
    return { isValid: false, validationDetails: details }
  }
}
