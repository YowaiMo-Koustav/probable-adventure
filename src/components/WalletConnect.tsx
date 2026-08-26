import React, { useState } from 'react';
import { useMidnight } from '../hooks/useMidnight';
import { truncateAddress } from '../utils/contract';

interface WalletConnectProps {
  onAddressChange?: (address: string | null) => void;
}

export const WalletConnect: React.FC<WalletConnectProps> = () => {
  const {
    isConnected,
    isConnecting,
    unshieldedAddress,
    shieldedAddress,
    dustAddress,
    networkId,
    nightBalance,
    dustBalance,
    walletName,
    walletIcon,
    error,
    availableWallets,
    connectWallet,
    disconnectWallet,
  } = useMidnight();

  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card wallet-card">
      <div className="card-header">
        <h2 className="card-title">
          <span>💳</span> Midnight Wallet
        </h2>
        {isConnected && (
          <span className="badge badge-privacy">
            <span className="status-dot"></span> Connected
          </span>
        )}
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem 1rem',
          color: '#f87171',
          fontSize: '0.85rem',
          marginBottom: '1rem'
        }}>
          <strong>Connection Error:</strong> {error}
        </div>
      )}

      {isConnected && unshieldedAddress ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {walletIcon ? (
              <img src={walletIcon} alt={walletName || 'Wallet'} style={{ width: 36, height: 36, borderRadius: '50%' }} />
            ) : (
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem'
              }}>
                🌙
              </div>
            )}
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{walletName || 'Lace (Midnight)'}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Network: <span className="highlight-cyan">{networkId?.toUpperCase() || 'PREPROD'}</span></div>
            </div>
          </div>

          <div className="info-row">
            <span className="info-label">Unshielded Address</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="info-value">{truncateAddress(unshieldedAddress, 8, 6)}</span>
              <button
                onClick={() => handleCopy(unshieldedAddress)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copied ? 'var(--accent-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  padding: '2px 6px',
                }}
                title="Copy Address"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>

          {shieldedAddress && (
            <div className="info-row">
              <span className="info-label">Shielded Address</span>
              <span className="info-value">{truncateAddress(shieldedAddress, 8, 6)}</span>
            </div>
          )}

          {dustAddress && (
            <div className="info-row">
              <span className="info-label">Dust Address</span>
              <span className="info-value">{truncateAddress(dustAddress, 8, 6)}</span>
            </div>
          )}

          <div className="info-row">
            <span className="info-label">tNIGHT Balance</span>
            <span className="info-value highlight-purple">{nightBalance || '0'} tNIGHT</span>
          </div>

          <div className="info-row">
            <span className="info-label">DUST Balance</span>
            <span className="info-value highlight-cyan">{dustBalance || '0'} DUST</span>
          </div>

          {(nightBalance === '0' || !nightBalance) && (
            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.03)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
              Need test tokens?{' '}
              <a
                href="https://midnight-tmnight-preprod.nethermind.dev"
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
              >
                Get tNIGHT from Preprod Faucet &rarr;
              </a>
            </div>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <button className="btn btn-secondary" onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
            Connect your Lace wallet to interact with the Midnight Secret Santa zero-knowledge smart contract on the Preprod testnet.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => connectWallet('preprod')}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting to Lace...' : 'Connect Lace Wallet'}
          </button>

          {availableWallets.length > 1 && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {availableWallets.map((w) => (
                <button
                  key={w.key}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
                  onClick={() => connectWallet('preprod', w.key)}
                >
                  Connect {w.name}
                </button>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-dim)', textAlign: 'center' }}>
            Requires Lace Midnight extension configured for Preprod
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
