import React from 'react';
import { useMidnight } from '../hooks/useMidnight';

const WalletConnect: React.FC = () => {
  const { address, connectWallet, disconnectWallet, error } = useMidnight();

  return (
    <div className="card wallet-connect">
      <h2>Wallet Connection</h2>
      {error && <p className="error" style={{color: 'red'}}>{error}</p>}
      
      {address ? (
        <div>
          <p>Status: <span style={{color: 'lightgreen'}}>Connected</span></p>
          <p>Address: <br/> <small style={{wordBreak: 'break-all'}}>{address}</small></p>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
        </div>
      ) : (
        <div>
          <p>Status: <span style={{color: 'salmon'}}>Disconnected</span></p>
          <button onClick={connectWallet}>Connect Lace Wallet</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
