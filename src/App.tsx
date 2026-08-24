import React from 'react';
import WalletConnect from './components/WalletConnect';
import SecretSanta from './components/SecretSanta';

export function App() {
  return (
    <div className="app-container">
      {/* Top Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-logo">🎄</div>
          <div>
            <h1 className="brand-title">Midnight Secret Santa</h1>
            <p className="brand-subtitle">
              Zero-Knowledge Gift Exchange on Midnight Network (Preprod)
            </p>
          </div>
        </div>

        <div className="header-badges">
          <span className="badge badge-privacy">
            <span className="status-dot"></span> ZK Active
          </span>
          <span className="badge badge-network">Preprod Testnet</span>
        </div>
      </header>

      {/* Main Two-Column Layout */}
      <main className="main-grid">
        <aside>
          <WalletConnect />

          {/* Quick Info Card */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ fontSize: '1rem' }}>
                <span>💡</span> How It Works
              </h3>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>1. Register:</strong> Participants publish their unshielded public key to join the pool.
              </p>
              <p style={{ marginBottom: '0.75rem' }}>
                <strong>2. Secret Pairing:</strong> Organizer or algorithm produces assignments off-chain.
              </p>
              <p>
                <strong>3. ZK Proof:</strong> You prove you were assigned a valid participant without disclosing who!
              </p>
            </div>
          </div>
        </aside>

        <section>
          <SecretSanta />
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built for the <strong>Midnight Builder Challenge (Level 1, 2 & 3)</strong> &bull; Powered by{' '}
          <a href="https://midnight.network" target="_blank" rel="noreferrer">
            Midnight Network
          </a>{' '}
          &bull; Compact Smart Contracts
        </p>
      </footer>
    </div>
  );
}

export default App;
