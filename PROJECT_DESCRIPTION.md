# Project Description

**Deployed Frontend URL:** https://votee-solana.vercel.app/

**Solana Program ID:** 8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee

**Network:** Solana Devnet

**Deployment Signature:** 4S2GDJcc4MT8Sc9piGrYYRnPYe5ZuMhzo4gxwi2bbNMSciJiQZy13QQfXPonmsHKUkPCQq3G1gAMsksaQcuTjEQ8

**IDL Account:** AEXVu8NQJaSrMVnScc4rgVuDYfnYDNV2utfBMavbuxib

**Program Explorer:** https://explorer.solana.com/address/8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee?cluster=devnet

## Project Overview

### Description
Votee is a decentralized polling application built on the Solana blockchain that enables users to create polls, register candidates, and cast votes in a transparent and secure manner. The dApp leverages Program Derived Addresses (PDAs) to ensure deterministic account creation and prevent conflicts between different polls and candidates. Each poll has a unique identifier derived from a global counter, and candidates are uniquely identified within each poll. The voting system ensures one vote per user per poll through voter accounts that track voting status.

The application provides a complete voting ecosystem where:
- Poll creators can set up polls with descriptions, start dates, and end dates
- Candidates can register themselves for active polls
- Voters can cast their votes for registered candidates during the active poll period
- All voting data is stored on-chain, ensuring transparency and immutability

### Key Features
- **Create Polls**: Users can create polls with custom descriptions, start dates, and end dates. Each poll gets a unique ID from a global counter.
- **Register Candidates**: Candidates can register for active polls by providing their name. Each candidate receives a unique ID within the poll.
- **Vote on Polls**: Users can cast votes for registered candidates during the active poll period. The system prevents duplicate voting through voter accounts.
- **Real-Time Blockchain Data**: All poll data, candidate information, and vote counts are fetched directly from the Solana blockchain.
- **Wallet Integration**: Seamless integration with Solana-compatible wallets (Phantom, etc.) for authentication and transaction signing.
- **Date Validation**: Polls validate that start dates are before end dates to prevent invalid poll configurations.
- **Voting Constraints**: The system enforces that votes can only be cast during active poll periods and prevents users from voting twice.

### How to Use the dApp
1. **Connect Wallet**
   - Click the "Connect Wallet" button in the header
   - Select your Solana wallet (e.g., Phantom) and approve the connection

2. **Create a Poll**
   - Navigate to the "Create Poll" page
   - Enter a poll description (e.g., "Best Programming Language 2024")
   - Set the start date and time when voting should begin
   - Set the end date and time when voting should close
   - Click "Create Poll" and approve the transaction in your wallet
   - Wait for transaction confirmation

3. **Register as a Candidate**
   - Navigate to a poll's detail page
   - Click "Register Candidate" button
   - Enter your candidate name
   - Approve the transaction in your wallet
   - Wait for confirmation

4. **Vote for a Candidate**
   - Navigate to a poll's detail page
   - View the list of registered candidates
   - Click "Vote" next to your preferred candidate
   - Approve the transaction in your wallet
   - Wait for confirmation and see updated vote counts

5. **View Poll Results**
   - Visit any poll's detail page to see real-time vote counts for each candidate
   - Vote counts are fetched directly from the blockchain

## Program Architecture

The Votee program uses a modular architecture with separate instruction handlers for each operation. The program leverages PDAs extensively to create deterministic accounts for polls, candidates, and voters. The architecture ensures data isolation between different polls and prevents unauthorized modifications through account ownership validation.

### PDA Usage
The program uses Program Derived Addresses to create deterministic accounts that can be recreated using the same seeds, ensuring consistent addressing across the application.

**PDAs Used:**
- **Counter PDA**: Derived from seed `["counter"]` - Global counter that tracks the total number of polls created. This ensures each poll gets a unique sequential ID.
- **Registerations PDA**: Derived from seed `["registerations"]` - Global counter that tracks the total number of candidate registrations across all polls. Used to assign unique candidate IDs.
- **Poll PDA**: Derived from seed `[poll_id.to_le_bytes()]` - Unique account for each poll, storing poll metadata including description, start/end dates, and candidate count.
- **Candidate PDA**: Derived from seeds `[poll_id.to_le_bytes(), candidate_id.to_le_bytes()]` - Unique account for each candidate within a poll, storing candidate information and vote count.
- **Voter PDA**: Derived from seeds `["voter", poll_id.to_le_bytes(), user_pubkey.to_bytes()]` - Unique account per user per poll, tracking whether the user has voted and which candidate they voted for. This ensures one vote per user per poll.

### Program Instructions
**Instructions Implemented:**
- **Initialize**: Initializes the global counter and registrations accounts. These accounts track the total number of polls and candidates created. This instruction should be called once before creating any polls.
- **Create Poll**: Creates a new poll with a description, start date, and end date. Validates that start date is before end date. Increments the global counter and creates a new poll account with a unique ID.
- **Register Candidate**: Registers a candidate for a specific poll. Validates that the poll exists and that the candidate hasn't already been registered. Increments both the poll's candidate count and the global registrations counter.
- **Vote**: Allows a user to vote for a candidate in a poll. Validates that the candidate is registered, the poll is currently active (current time is between start and end dates), and the user hasn't already voted. Creates a voter account to track the vote and increments the candidate's vote count.

### Account Structure
```rust
// Global counter for poll IDs
#[account]
pub struct Counter {
    pub count: u64,  // Total number of polls created
}

// Global counter for candidate IDs
#[account]
pub struct Registerations {
    pub count: u64,  // Total number of candidates registered across all polls
}

// Poll account storing poll metadata
#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub id: u64,                    // Unique poll identifier
    #[max_len(280)]
    pub description: String,        // Poll description (max 280 characters)
    pub start: u64,                  // Unix timestamp when poll starts
    pub end: u64,                    // Unix timestamp when poll ends
    pub candidates: u64,             // Number of candidates registered for this poll
}

// Candidate account storing candidate information
#[account]
#[derive(InitSpace)]
pub struct Candidate {
    pub cid: u64,                    // Unique candidate ID within the poll
    pub poll_id: u64,                // ID of the poll this candidate belongs to
    #[max_len(32)]
    pub name: String,                // Candidate name (max 32 characters)
    pub votes: u64,                  // Total number of votes received
    pub has_registered: bool,        // Whether the candidate has completed registration
}

// Voter account tracking user votes
#[account]
pub struct Voter {
    pub cid: u64,                    // ID of the candidate the user voted for
    pub poll_id: u64,                // ID of the poll the user voted in
    pub has_voted: bool,             // Whether the user has cast their vote
}
```

## Testing

### Test Coverage
Comprehensive test suite covering all four instructions with both successful operations (happy paths) and error conditions (unhappy paths) to ensure program security, reliability, and proper error handling.

**Happy Path Tests:**
- **Initialize**: Successfully initializes the counter and registrations accounts with count values of 0. Verifies that accounts are created correctly.
- **Create Poll**: Successfully creates a poll with valid dates (start < end). Verifies that poll ID, description, start/end dates, and candidate count are set correctly. Confirms the global counter is incremented.
- **Register Candidate**: Successfully registers a candidate for a poll. Verifies that candidate information (ID, poll ID, name) is stored correctly, registration flag is set, and both poll candidate count and global registrations counter are incremented.
- **Vote**: Successfully casts a vote for a registered candidate during an active poll. Verifies that voter account is created with correct information, vote count is incremented, and duplicate voting is prevented.

**Unhappy Path Tests:**
- **Create Poll with Invalid Dates**: Fails when attempting to create a poll where start date is greater than or equal to end date. Verifies that the `InvalidDates` error is thrown.
- **Register Candidate Twice**: Fails when attempting to register the same candidate account twice. Verifies that the `CandidateAlreadyRegistered` error or account already in use error is thrown.
- **Vote Twice**: Fails when a user attempts to vote multiple times in the same poll. Verifies that the `VoterAlreadyVoted` error is thrown when trying to vote after already voting.
- **Vote Before Poll Starts**: Fails when attempting to vote before the poll's start date. Verifies that the `PollNotActive` error is thrown when current time is before poll start time.
- **Vote for Unregistered Candidate**: Fails when attempting to vote for a candidate that hasn't been registered. Verifies that the `CandidateNotRegistered` error or account not initialized error is thrown.

### Running Tests
```bash
# Navigate to the anchor project directory
cd anchor_project

# Install dependencies (if not already installed)
npm install

# Run all tests (both happy and unhappy paths)
anchor test

# Or run tests with verbose output
anchor test --skip-local-validator
```

The test suite uses Anchor's testing framework with a local validator. Tests are organized to first set up the program state (initialize), then test happy paths, followed by unhappy paths that verify error handling.

### Additional Notes for Evaluators

**Program Deployment**: The program is deployed to Solana Devnet. The program ID in `lib.rs` matches the deployed program ID: `8jEXKrgnFUstSuFvGBbn5tLU9GQQbteuvvAwBCGPyBee`. The `Anchor.toml` file contains configuration for both localnet and devnet deployments. The program has been successfully deployed and the IDL account has been created.

**Frontend Integration**: The frontend is built with Next.js and uses the Solana Wallet Adapter for wallet connections. The frontend fetches program data directly from the blockchain using the Anchor client. Ensure the frontend's RPC endpoint is configured correctly (defaults to localhost for development, should be updated for production).

**Key Design Decisions**:
1. **PDA-based Addressing**: All accounts use PDAs to ensure deterministic addressing and prevent account conflicts. This allows the frontend to derive account addresses without needing to store them.
2. **Global Counters**: Two global counters (poll counter and registrations counter) ensure unique IDs across the entire system, preventing ID collisions.
3. **Voter Accounts**: Each user gets a unique voter account per poll, stored as a PDA. This design ensures one vote per user per poll without requiring complex state management.
4. **Time-based Validation**: Polls validate that votes can only be cast during active periods (between start and end dates) using Solana's Clock sysvar.

**Potential Improvements**: Future enhancements could include poll result aggregation, voting history queries, poll closure instructions, and support for different voting mechanisms (ranked choice, approval voting, etc.).
