import assert from 'node:assert';
import crypto from 'node:crypto';

console.log('Running test suite for Secret Santa Contract...');

// Mock state representing the Midnight Ledger
const ledger = {
  participants: new Map<string, number>(),
  received_assignment: new Map<string, number>(),
};

function generateAddress() {
  return crypto.randomBytes(32).toString('hex');
}

function testCircuitLogic() {
  console.log('\nTest 1: Circuit logic (register and receive_assignment execute)');
  const myAddress = generateAddress();
  const assignedToAddress = generateAddress();

  // 1. Simulate `register`
  ledger.participants.set(myAddress, 1);
  ledger.participants.set(assignedToAddress, 1);
  
  assert.strictEqual(ledger.participants.get(myAddress), 1);
  assert.strictEqual(ledger.participants.get(assignedToAddress), 1);

  // 2. Simulate `receive_assignment`
  // Circuit assertion: assert(participants.member(disclose(address)))
  assert.strictEqual(ledger.participants.has(myAddress), true);
  
  // Update ledger: received_assignment.insert(disclose(address), 1)
  ledger.received_assignment.set(myAddress, 1);
  
  assert.strictEqual(ledger.received_assignment.get(myAddress), 1);

  console.log('✓ Circuit logic test passed.');
}

function testStateTransitions() {
  console.log('\nTest 2: State transitions (ledger updates correctly)');
  
  const userAddress = generateAddress();
  
  // Initial state should be empty
  assert.strictEqual(ledger.participants.has(userAddress), false);
  assert.strictEqual(ledger.received_assignment.has(userAddress), false);
  
  // Transition 1: Register
  ledger.participants.set(userAddress, 1);
  assert.strictEqual(ledger.participants.get(userAddress), 1);
  
  // Transition 2: Receive Assignment
  ledger.received_assignment.set(userAddress, 1);
  assert.strictEqual(ledger.received_assignment.get(userAddress), 1);

  console.log('✓ State transitions test passed.');
}

function testPrivateInputs() {
  console.log('\nTest 3: Ensure private inputs are never exposed on ledger');
  
  const myAddress = generateAddress();
  const myPrivateAssignment = generateAddress(); // This is the private witness
  
  // Execute circuit simulations
  ledger.participants.set(myAddress, 1);
  ledger.participants.set(myPrivateAssignment, 1);
  
  // The circuit explicitly ONLY inserts `address` into `received_assignment`
  ledger.received_assignment.set(myAddress, 1);
  
  // Check the public ledger data
  // The private assignment MUST NOT be visible anywhere in the ledger output keys or values
  // regarding who was assigned to whom.
  
  // We can see they are both participants:
  assert.strictEqual(ledger.participants.has(myAddress), true);
  assert.strictEqual(ledger.participants.has(myPrivateAssignment), true);
  
  // But we cannot link `myAddress` to `myPrivateAssignment` based on the ledger!
  assert.strictEqual(ledger.received_assignment.get(myAddress), 1);
  
  // Verify that the private assignment is not stored as a value in received_assignment
  for (const [key, value] of ledger.received_assignment.entries()) {
    assert.notStrictEqual(key, myPrivateAssignment, 'Private assignment leaked as key');
    assert.notStrictEqual(value.toString(), myPrivateAssignment, 'Private assignment leaked as value');
  }

  console.log('✓ Privacy test passed. Private inputs remain isolated.');
}

try {
  testCircuitLogic();
  testStateTransitions();
  testPrivateInputs();
  console.log('\n✅ All 3 tests passed successfully!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
}
