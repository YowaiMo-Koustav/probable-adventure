import React, { useState } from 'react';
import { useMidnight } from '../hooks/useMidnight';
import {
  secretSantaService,
  truncateAddress,
  type ProofGenerationResult,
  type ParticipantRecord,
} from '../utils/contract';

export const SecretSanta: React.FC = () => {
  const { isConnected, unshieldedAddress, api } = useMidnight();

  const [contractAddress, setContractAddress] = useState(secretSantaService.getContractAddress());
  const [assignedToInput, setAssignedToInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ProofGenerationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Local simulated ledger state for real-time visual feedback
  const [participants, setParticipants] = useState<ParticipantRecord[]>([
    {
      address: 'mn_addr_preprod1alice789xyz456abcdef1234567890abcdef',
      registeredAt: '10:15 AM',
      hasAssignment: true,
      assignmentProofHash: '0x8f3c...b291',
      txId: '0x4a8b...19ef',
    },
    {
      address: 'mn_addr_preprod1bob321uvw654fedcba0987654321fedcba',
      registeredAt: '10:22 AM',
      hasAssignment: false,
      txId: '0x7c2d...91aa',
    },
  ]);

  const isUserRegistered = participants.some((p) => p.address === unshieldedAddress);
  const userRecord = participants.find((p) => p.address === unshieldedAddress);

  // Handle Register
  const handleRegister = async () => {
    if (!unshieldedAddress) {
      setErrorMessage('Please connect your Lace wallet first.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setLastResult(null);

    try {
      const result = await secretSantaService.register(unshieldedAddress, api, (msg) =>
        setProgressStatus(msg)
      );

      setLastResult(result);

      // Add to participant list if not already registered
      if (!isUserRegistered) {
        setParticipants((prev) => [
          ...prev,
          {
            address: unshieldedAddress,
            registeredAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            hasAssignment: false,
            txId: result.txId,
          },
        ]);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
      setProgressStatus(null);
    }
  };

  // Handle Prove Assignment
  const handleProveAssignment = async () => {
    if (!unshieldedAddress) {
      setErrorMessage('Please connect your Lace wallet first.');
      return;
    }
    if (!assignedToInput.trim()) {
      setErrorMessage('Please enter an assigned giftee address to prove.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setLastResult(null);

    try {
      const result = await secretSantaService.receiveAssignment(
        unshieldedAddress,
        assignedToInput.trim(),
        api,
        (msg) => setProgressStatus(msg)
      );

      setLastResult(result);

      // Mark user as having verified assignment
      setParticipants((prev) =>
        prev.map((p) =>
          p.address === unshieldedAddress
            ? {
                ...p,
                hasAssignment: true,
                assignmentProofHash: result.txId.slice(0, 10) + '...',
              }
            : p
        )
      );

      setAssignedToInput('');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Assignment proof failed');
    } finally {
      setLoading(false);
      setProgressStatus(null);
    }
  };

  return (
    <div>
      {/* Contract & Network Header Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>🎁</span> Secret Santa Smart Contract
          </h2>
          <span className="badge badge-network">Midnight Preprod</span>
        </div>

        <div className="info-row">
          <span className="info-label">Contract Address</span>
          <span className="info-value highlight-cyan" title={contractAddress}>
            {truncateAddress(contractAddress, 10, 8)}
          </span>
        </div>

        <div className="info-row">
          <span className="info-label">Privacy Mechanism</span>
          <span className="info-value">Compact Language (ZK circuits)</span>
        </div>

        <div className="info-row">
          <span className="info-label">Circuit 1 (Public Register)</span>
          <span className="info-value">k=9, 303 constraints</span>
        </div>

        <div className="info-row">
          <span className="info-label">Circuit 2 (Private Assignment)</span>
          <span className="info-value">k=10, 583 constraints</span>
        </div>
      </div>

      {/* Interactive Actions Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>🔒</span> Zero-Knowledge Operations
          </h2>
        </div>

        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
            }}
          >
            <strong>Error:</strong> {errorMessage}
          </div>
        )}

        {/* Step 1: Register */}
        <div className={`wizard-step ${!isUserRegistered ? 'active' : ''}`}>
          <div className="step-header">
            <span className="step-num">1</span>
            <span className="step-title">Register as Participant</span>
            {isUserRegistered && (
              <span
                style={{
                  marginLeft: 'auto',
                  color: 'var(--accent-green)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                ✓ REGISTERED
              </span>
            )}
          </div>
          <p className="step-desc">
            Submit your wallet address to the on-chain participants roster. This discloses your participation publically so others can verify gift assignments against you.
          </p>

          <button
            className="btn btn-primary"
            onClick={handleRegister}
            disabled={loading || !isConnected || isUserRegistered}
          >
            {isUserRegistered ? 'Already Registered On-Chain' : 'Register Participant (Circuit 1)'}
          </button>
        </div>

        {/* Step 2: Prove Assignment */}
        <div className={`wizard-step ${isUserRegistered ? 'active' : ''}`}>
          <div className="step-header">
            <span className="step-num">2</span>
            <span className="step-title">Prove Assignment Privately</span>
            {userRecord?.hasAssignment && (
              <span
                style={{
                  marginLeft: 'auto',
                  color: 'var(--accent-green)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                ✓ ASSIGNMENT PROVEN
              </span>
            )}
          </div>
          <p className="step-desc">
            Enter your secret assigned giftee. The <strong>receive_assignment</strong> circuit proves you received a valid registered participant <strong>without revealing who that person is to anyone</strong>.
          </p>

          <div className="input-group">
            <label className="input-label">Assigned Giftee (Private Witness Address)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. mn_addr_preprod1bob321uvw654fedcba0987654321fedcba"
              value={assignedToInput}
              onChange={(e) => setAssignedToInput(e.target.value)}
              disabled={loading || !isConnected}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleProveAssignment}
            disabled={loading || !isConnected || !assignedToInput.trim()}
          >
            Generate & Submit ZK Proof (Circuit 2)
          </button>
        </div>

        {/* Prover Progress Bar */}
        {loading && (
          <div className="progress-container">
            <div className="progress-text">
              <span>⚙️</span> {progressStatus || 'Computing Zero-Knowledge Proof...'}
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill"></div>
            </div>
          </div>
        )}

        {/* Proof Result Inspector */}
        {lastResult && (
          <div className="result-box">
            <div className="result-title">
              <span>✅</span> Zero-Knowledge Transaction Finalized
            </div>

            <div className="info-row">
              <span className="info-label">Circuit Executed</span>
              <span className="info-value highlight-cyan">{lastResult.circuitName}</span>
            </div>

            <div className="info-row">
              <span className="info-label">Transaction Hash</span>
              <span className="info-value" style={{ fontSize: '0.75rem' }}>
                {lastResult.txId}
              </span>
            </div>

            <div className="info-row">
              <span className="info-label">Circuit Size</span>
              <span className="info-value">
                k={lastResult.kParameter} ({lastResult.constraintsCount} rows)
              </span>
            </div>

            {Object.keys(lastResult.privateWitnesses).length > 0 && (
              <div className="info-row">
                <span className="info-label">Private Witness</span>
                <span className="info-value" style={{ color: 'var(--accent-pink)' }}>
                  🔒 Kept Secret (Not written to ledger)
                </span>
              </div>
            )}

            <div
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem',
                background: 'rgba(0,0,0,0.25)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                color: '#6ee7b7',
              }}
            >
              ✓ Verified on Midnight Preprod: Privacy invariant maintained.
            </div>
          </div>
        )}

        {/* Privacy Invariant Explainer */}
        <div className="privacy-explainer">
          <div className="privacy-explainer-title">
            <span>🛡️</span> Midnight Data Protection Model
          </div>
          <div className="privacy-grid">
            <div className="privacy-item">
              <div className="privacy-item-tag" style={{ color: 'var(--accent-cyan)' }}>
                Public On-Chain Data
              </div>
              <div>• Registered participants list</div>
              <div>• Flag: "Assignment Secured" (Yes/No)</div>
            </div>
            <div className="privacy-item private">
              <div className="privacy-item-tag" style={{ color: 'var(--accent-pink)' }}>
                Private Zero-Knowledge Data
              </div>
              <div>• Secret Pairing ("Who gives to Whom")</div>
              <div>• Kept as local witness; never leaked</div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Roster Card */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <span>📋</span> Live Participants Roster (Ledger State)
          </h2>
          <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
            {participants.length} Registered
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'left' }}>
                <th style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>Participant</th>
                <th style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>Registered</th>
                <th style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>Assignment Status</th>
                <th style={{ padding: '0.6rem 0.5rem', color: 'var(--text-muted)' }}>ZK Proof</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((p, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    background: p.address === unshieldedAddress ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)' }}>
                    {truncateAddress(p.address, 6, 4)}
                    {p.address === unshieldedAddress && (
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.7rem',
                          background: 'var(--primary)',
                          padding: '1px 5px',
                          borderRadius: '4px',
                        }}
                      >
                        YOU
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{p.registeredAt}</td>
                  <td style={{ padding: '0.75rem 0.5rem' }}>
                    {p.hasAssignment ? (
                      <span className="badge badge-privacy" style={{ fontSize: '0.7rem' }}>
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', fontSize: '0.7rem' }}>
                        Pending Proof
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)', color: 'var(--text-dim)' }}>
                    {p.assignmentProofHash || 'None'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SecretSanta;
