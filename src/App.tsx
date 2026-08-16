import React from 'react';
import WalletConnect from './components/WalletConnect';
import SecretSanta from './components/SecretSanta';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Private Secret Santa</h1>
        <p>Register and securely receive your Secret Santa assignment on Midnight Network.</p>
      </header>
      
      <main>
        <WalletConnect />
        <SecretSanta />
      </main>
    </div>
  );
}

export default App;
