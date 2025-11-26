const anchor = require('@coral-xyz/anchor')
const { SystemProgram, PublicKey, Keypair } = anchor.web3
const assert = require('assert')

describe('votee', () => {
  const provider = anchor.AnchorProvider.local()
  anchor.setProvider(provider)
  const program = anchor.workspace.Votee

  let PID: any, CID: any, counterPda: PublicKey, registerationsPda: PublicKey

  // ========== HAPPY PATH TESTS ==========

  it('Initializes the program', async () => {
    const user = provider.wallet

    // Derive the PDA for the counter account
    const [counter] = await PublicKey.findProgramAddress(
      [Buffer.from('counter')],
      program.programId
    )
    counterPda = counter

    const [registerations] = await PublicKey.findProgramAddress(
      [Buffer.from('registerations')],
      program.programId
    )
    registerationsPda = registerations

    // Attempt to fetch the counter account, skip initialization if it exists
    try {
      await program.account.counter.fetch(counterPda)
      console.log('Counter account already exists')
    } catch (err) {
      console.log('Counter account does not exist. Initializing...')
      await program.rpc.initialize({
        accounts: {
          user: user.publicKey,
          counter: counterPda,
          registerations: registerationsPda,
          systemProgram: SystemProgram.programId,
        },
      })

      // Verify initialization
      const counter = await program.account.counter.fetch(counterPda)
      assert.equal(counter.count.toString(), '0', 'Counter should start at 0')
      console.log('Counter initialized successfully')
    }
  })

  it('Creates a poll with valid dates', async () => {
    const user = provider.wallet

    // Get current counter value
    const counter = await program.account.counter.fetch(counterPda)
    PID = counter.count.add(new anchor.BN(1))

    const [pollPda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const description = `Test Poll #${PID}`
    const currentTime = Math.floor(Date.now() / 1000)
    const start = new anchor.BN(currentTime)
    const end = new anchor.BN(currentTime + 86400) // 24 hours later

    await program.rpc.createPoll(description, start, end, {
      accounts: {
        user: user.publicKey,
        poll: pollPda,
        counter: counterPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [],
    })

    // Verify that the poll was created with the correct data
    const poll = await program.account.poll.fetch(pollPda)
    assert.equal(poll.id.toString(), PID.toString(), 'Poll ID should match')
    assert.equal(poll.description, description, 'Description should match')
    assert.equal(poll.start.toString(), start.toString(), 'Start time should match')
    assert.equal(poll.end.toString(), end.toString(), 'End time should match')
    assert.equal(poll.candidates.toString(), '0', 'Candidates should start at 0')
    console.log('Poll created successfully:', poll)
  })

  it('Registers a candidate', async () => {
    const user = provider.wallet

    const [pollPda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const regs = await program.account.registerations.fetch(registerationsPda)
    CID = regs.count.add(new anchor.BN(1))

    const candidateName = `Candidate #${CID}`
    const [candidatePda] = await PublicKey.findProgramAddress(
      [
        PID.toArrayLike(Buffer, 'le', 8),
        CID.toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    )

    await program.rpc.registerCandidate(PID, candidateName, {
      accounts: {
        poll: pollPda,
        candidate: candidatePda,
        registerations: registerationsPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      },
    })

    const candidate = await program.account.candidate.fetch(candidatePda)
    assert.equal(candidate.has_registered, true, 'Candidate should be registered')
    assert.equal(candidate.poll_id.toString(), PID.toString(), 'Poll ID should match')
    assert.equal(candidate.name, candidateName, 'Name should match')
    assert.equal(candidate.votes.toString(), '0', 'Votes should start at 0')
    console.log('Candidate registered successfully:', candidate)
  })

  it('Votes for a candidate', async () => {
    const user = provider.wallet

    const [pollPda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [candidatePda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [voterPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('voter'),
        PID.toArrayLike(Buffer, 'le', 8),
        user.publicKey.toBuffer(),
      ],
      program.programId
    )

    // Get initial vote count
    const candidateBefore = await program.account.candidate.fetch(candidatePda)
    const initialVotes = candidateBefore.votes

    // Perform the vote
    await program.rpc.vote(PID, CID, {
      accounts: {
        user: user.publicKey,
        poll: pollPda,
        candidate: candidatePda,
        voter: voterPda,
        systemProgram: SystemProgram.programId,
      },
    })

    // Verify voter account
    const voterAccount = await program.account.voter.fetch(voterPda)
    assert.equal(voterAccount.has_voted, true, 'Voter should have voted')
    assert.equal(voterAccount.poll_id.toString(), PID.toString(), 'Poll ID should match')
    assert.equal(voterAccount.cid.toString(), CID.toString(), 'Candidate ID should match')

    // Verify candidate vote count increased
    const candidateAfter = await program.account.candidate.fetch(candidatePda)
    assert.equal(
      candidateAfter.votes.toString(),
      initialVotes.add(new anchor.BN(1)).toString(),
      'Vote count should increase by 1'
    )
    console.log('Vote successful. Candidate votes:', candidateAfter.votes.toString())
  })

  // ========== UNHAPPY PATH TESTS ==========

  it('Fails to create poll with invalid dates (start >= end)', async () => {
    const user = provider.wallet

    const counter = await program.account.counter.fetch(counterPda)
    const invalidPID = counter.count.add(new anchor.BN(1))

    const [pollPda] = await PublicKey.findProgramAddress(
      [invalidPID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const currentTime = Math.floor(Date.now() / 1000)
    const start = new anchor.BN(currentTime + 86400) // Start in the future
    const end = new anchor.BN(currentTime) // End in the past (invalid)

    try {
      await program.rpc.createPoll('Invalid Poll', start, end, {
        accounts: {
          user: user.publicKey,
          poll: pollPda,
          counter: counterPda,
          systemProgram: SystemProgram.programId,
        },
        signers: [],
      })
      assert.fail('Should have thrown an error for invalid dates')
    } catch (err) {
      assert.ok(err.toString().includes('InvalidDates') || err.toString().includes('Start date cannot be greater than end date'), 'Should throw InvalidDates error')
      console.log('Correctly rejected poll with invalid dates')
    }
  })

  it('Fails to register candidate twice', async () => {
    const user = provider.wallet

    const [pollPda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const regs = await program.account.registerations.fetch(registerationsPda)
    const duplicateCID = regs.count.add(new anchor.BN(1))

    // First registration should succeed
    const candidateName = `Duplicate Candidate`
    const [candidatePda] = await PublicKey.findProgramAddress(
      [
        PID.toArrayLike(Buffer, 'le', 8),
        duplicateCID.toArrayLike(Buffer, 'le', 8),
      ],
      program.programId
    )

    await program.rpc.registerCandidate(PID, candidateName, {
      accounts: {
        poll: pollPda,
        candidate: candidatePda,
        registerations: registerationsPda,
        user: user.publicKey,
        systemProgram: SystemProgram.programId,
      },
    })

    // Try to register again with same candidate PDA (should fail)
    try {
      await program.rpc.registerCandidate(PID, 'Duplicate Name', {
        accounts: {
          poll: pollPda,
          candidate: candidatePda,
          registerations: registerationsPda,
          user: user.publicKey,
          systemProgram: SystemProgram.programId,
        },
      })
      assert.fail('Should have thrown an error for duplicate registration')
    } catch (err) {
      assert.ok(
        err.toString().includes('CandidateAlreadyRegistered') ||
        err.toString().includes('already in use') ||
        err.toString().includes('AccountDiscriminatorAlreadySet'),
        'Should throw CandidateAlreadyRegistered or account already in use error'
      )
      console.log('Correctly rejected duplicate candidate registration')
    }
  })

  it('Fails to vote twice', async () => {
    const user = provider.wallet

    const [pollPda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [candidatePda] = await PublicKey.findProgramAddress(
      [PID.toArrayLike(Buffer, 'le', 8), CID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [voterPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('voter'),
        PID.toArrayLike(Buffer, 'le', 8),
        user.publicKey.toBuffer(),
      ],
      program.programId
    )

    // Verify voter has already voted (from previous test)
    const voter = await program.account.voter.fetch(voterPda)
    assert.equal(voter.has_voted, true, 'Voter should have already voted')

    // Try to vote again (should fail)
    try {
      await program.rpc.vote(PID, CID, {
        accounts: {
          user: user.publicKey,
          poll: pollPda,
          candidate: candidatePda,
          voter: voterPda,
          systemProgram: SystemProgram.programId,
        },
      })
      assert.fail('Should have thrown an error for duplicate vote')
    } catch (err) {
      assert.ok(
        err.toString().includes('VoterAlreadyVoted') ||
        err.toString().includes('Voter cannot vote twice'),
        'Should throw VoterAlreadyVoted error'
      )
      console.log('Correctly rejected duplicate vote')
    }
  })

  it('Fails to vote when poll is not active (before start)', async () => {
    const user = provider.wallet
    const newUser = Keypair.generate()

    // Airdrop SOL to new user
    await provider.connection.requestAirdrop(newUser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create a new poll that starts in the future
    const counter = await program.account.counter.fetch(counterPda)
    const futurePID = counter.count.add(new anchor.BN(1))

    const [futurePollPda] = await PublicKey.findProgramAddress(
      [futurePID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const currentTime = Math.floor(Date.now() / 1000)
    const futureStart = new anchor.BN(currentTime + 3600) // 1 hour in future
    const futureEnd = new anchor.BN(currentTime + 86400) // 24 hours in future

    await program.rpc.createPoll('Future Poll', futureStart, futureEnd, {
      accounts: {
        user: provider.wallet.publicKey,
        poll: futurePollPda,
        counter: counterPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [],
    })

    // Register a candidate
    const regs = await program.account.registerations.fetch(registerationsPda)
    const futureCID = regs.count.add(new anchor.BN(1))

    const [futureCandidatePda] = await PublicKey.findProgramAddress(
      [futurePID.toArrayLike(Buffer, 'le', 8), futureCID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    await program.rpc.registerCandidate(futurePID, 'Future Candidate', {
      accounts: {
        poll: futurePollPda,
        candidate: futureCandidatePda,
        registerations: registerationsPda,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [],
    })

    // Try to vote before poll starts (should fail)
    const [futureVoterPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('voter'),
        futurePID.toArrayLike(Buffer, 'le', 8),
        newUser.publicKey.toBuffer(),
      ],
      program.programId
    )

    try {
      await program.rpc.vote(futurePID, futureCID, {
        accounts: {
          user: newUser.publicKey,
          poll: futurePollPda,
          candidate: futureCandidatePda,
          voter: futureVoterPda,
          systemProgram: SystemProgram.programId,
        },
        signers: [newUser],
      })
      assert.fail('Should have thrown an error for voting before poll starts')
    } catch (err) {
      assert.ok(
        err.toString().includes('PollNotActive') ||
        err.toString().includes('Poll not currently active'),
        'Should throw PollNotActive error'
      )
      console.log('Correctly rejected vote before poll starts')
    }
  })

  it('Fails to vote for unregistered candidate', async () => {
    const user = provider.wallet
    const newUser = Keypair.generate()

    // Airdrop SOL to new user
    await provider.connection.requestAirdrop(newUser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL)
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create a new poll
    const counter = await program.account.counter.fetch(counterPda)
    const newPID = counter.count.add(new anchor.BN(1))

    const [newPollPda] = await PublicKey.findProgramAddress(
      [newPID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const currentTime = Math.floor(Date.now() / 1000)
    const start = new anchor.BN(currentTime - 3600) // Started 1 hour ago
    const end = new anchor.BN(currentTime + 86400) // Ends in 24 hours

    await program.rpc.createPoll('Active Poll', start, end, {
      accounts: {
        user: provider.wallet.publicKey,
        poll: newPollPda,
        counter: counterPda,
        systemProgram: SystemProgram.programId,
      },
      signers: [],
    })

    // Try to vote for a candidate that doesn't exist (should fail)
    const fakeCID = new anchor.BN(999)
    const [fakeCandidatePda] = await PublicKey.findProgramAddress(
      [newPID.toArrayLike(Buffer, 'le', 8), fakeCID.toArrayLike(Buffer, 'le', 8)],
      program.programId
    )

    const [newVoterPda] = await PublicKey.findProgramAddress(
      [
        Buffer.from('voter'),
        newPID.toArrayLike(Buffer, 'le', 8),
        newUser.publicKey.toBuffer(),
      ],
      program.programId
    )

    try {
      await program.rpc.vote(newPID, fakeCID, {
        accounts: {
          user: newUser.publicKey,
          poll: newPollPda,
          candidate: fakeCandidatePda,
          voter: newVoterPda,
          systemProgram: SystemProgram.programId,
        },
        signers: [newUser],
      })
      assert.fail('Should have thrown an error for voting for unregistered candidate')
    } catch (err) {
      assert.ok(
        err.toString().includes('CandidateNotRegistered') ||
        err.toString().includes('AccountNotInitialized') ||
        err.toString().includes('Candidate is not in the poll'),
        'Should throw CandidateNotRegistered or account not initialized error'
      )
      console.log('Correctly rejected vote for unregistered candidate')
    }
  })
})
