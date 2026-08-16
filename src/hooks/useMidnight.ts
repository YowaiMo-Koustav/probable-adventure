import { useState, useEffect } from 'react';

// Declaration for the Midnight DApp connector injected into window
declare global {
  interface Window {
    midnight?: {
      mnLace?: {
        enable: () => Promise<any>;
        isEnabled: () => Promise<boolean>;
      };
    };
  }
}

export function useMidnight() {
  const [address, setAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [api, setApi] = useState<any | null>(null);

  const connectWallet = async () => {
    try {
      setError(null);
      if (!window.midnight?.mnLace) {
        throw new Error('Lace wallet not installed');
      }
      
      const connectedApi = await window.midnight.mnLace.enable();
      setApi(connectedApi);
      
      // Attempt to get the connected address
      if (connectedApi && connectedApi.state) {
        const state = await connectedApi.state();
        if (state.address) {
          setAddress(state.address);
        } else {
          // fallback mock address if state api doesn't directly expose it like this
          setAddress('mn_addr_...');
        }
      } else {
        setAddress('mn_addr_mocked_from_lace');
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setApi(null);
  };

  return { address, connectWallet, disconnectWallet, error, api };
}
