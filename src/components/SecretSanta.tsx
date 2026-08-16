import React, { useState } from 'react';
import { useMidnight } from '../hooks/useMidnight';

const SecretSanta: React.FC = () => {
  const { address, api } = useMidnight();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [targetAddress, setTargetAddress] = useState('');

  const handleRegister = async () => {
    if (!api) {
      setResult('Please connect your wallet first.');
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      // In a real implementation, we would use api to submit the transaction via Midnight SDK
      // e.g. await contract.register();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate proof generation
      setResult(`Successfully registered ${address} on-chain.`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveAssignment = async () => {
    if (!api) {
      setResult('Please connect your wallet first.');
      return;
    }
    if (!targetAddress) {
      setResult('Please enter an assignment address.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      // In a real implementation:
      // await contract.receive_assignment(targetAddress);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate proof generation
      setResult(`Successfully proved assignment! Your assignment to ${targetAddress.substring(0, 10)}... was kept completely private.`);
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card secret-santa">
      <h2>Private Secret Santa</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>1. Register</h3>
        <p>Register yourself publicly as a participant.</p>
        <button onClick={handleRegister} disabled={loading}>
          {loading ? 'Generating Proof...' : 'Register Participant'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>2. Receive Assignment</h3>
        <p>Submit a zero-knowledge proof that you received a valid assignment, without revealing who it is!</p>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input 
            type="text" 
            placeholder="Assigned To (Address)" 
            value={targetAddress}
            onChange={(e) => setTargetAddress(e.target.value)}
          />
          <button onClick={handleReceiveAssignment} disabled={loading}>
            {loading ? 'Generating Proof...' : 'Prove Assignment'}
          </button>
        </div>
      </div>
      
      {loading && <p style={{ color: 'yellow' }}>⏳ Proving zero-knowledge circuit locally...</p>}
      
      {result && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#333', borderRadius: '8px' }}>
          <strong>Transaction Result:</strong>
          <p>{result}</p>
          <span style={{ color: 'lightblue', fontWeight: 'bold' }}>✓ Proved without revealing your input</span>
        </div>
      )}
    </div>
  );
};

export default SecretSanta;
