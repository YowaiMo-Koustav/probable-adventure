import { useState, useEffect, useCallback } from 'react';
import type { InitialAPI, ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

declare global {
  interface Window {
    midnight?: {
      [key: string]: InitialAPI;
    };
  }
}

export interface WalletState {
  isConnected: boolean;
  isConnecting: boolean;
  unshieldedAddress: string | null;
  shieldedAddress: string | null;
  dustAddress: string | null;
  networkId: string | null;
  nightBalance: string | null;
  dustBalance: string | null;
  walletName: string | null;
  walletIcon: string | null;
  error: string | null;
  api: ConnectedAPI | null;
}

export function useMidnight() {
  const [state, setState] = useState<WalletState>({
    isConnected: false,
    isConnecting: false,
    unshieldedAddress: null,
    shieldedAddress: null,
    dustAddress: null,
    networkId: null,
    nightBalance: null,
    dustBalance: null,
    walletName: null,
    walletIcon: null,
    error: null,
    api: null,
  });

  const [availableWallets, setAvailableWallets] = useState<Array<{ key: string; name: string; icon: string; rdns?: string }>>([]);

  // Detect injected Midnight wallets
  const detectWallets = useCallback(() => {
    if (typeof window === 'undefined' || !window.midnight) {
      setAvailableWallets([]);
      return;
    }

    const wallets: Array<{ key: string; name: string; icon: string; rdns?: string }> = [];
    for (const key of Object.keys(window.midnight)) {
      const w = window.midnight[key];
      if (w && typeof w.connect === 'function') {
        wallets.push({
          key,
          name: w.name || (key === 'mnLace' ? 'Lace (Midnight)' : key),
          icon: w.icon || '',
          rdns: w.rdns,
        });
      }
    }
    setAvailableWallets(wallets);
  }, []);

  useEffect(() => {
    detectWallets();
    // Poll briefly for extensions that inject after initial page load
    const interval = setInterval(detectWallets, 1000);
    const timeout = setTimeout(() => clearInterval(interval), 10000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [detectWallets]);

  const connectWallet = async (preferredNetwork: string = 'preprod', walletKey?: string) => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      if (typeof window === 'undefined' || !window.midnight) {
        throw new Error('Midnight Lace wallet extension is not installed. Please install Lace for Midnight.');
      }

      // Find target wallet instance
      const availableKeys = Object.keys(window.midnight);
      if (availableKeys.length === 0) {
        throw new Error('No Midnight wallet found in window.midnight.');
      }

      const targetKey = walletKey || (availableKeys.includes('mnLace') ? 'mnLace' : availableKeys[0]);
      const initialApi: any = window.midnight[targetKey];

      if (!initialApi) {
        throw new Error(`Wallet "${targetKey}" not found in window.midnight.`);
      }

      // The Midnight DApp connector specifies initialApi.connect(networkId)
      let connectedApi: ConnectedAPI;
      if (typeof initialApi.connect === 'function') {
        connectedApi = await initialApi.connect(preferredNetwork);
      } else if (typeof initialApi.enable === 'function') {
        // Fallback in case of hybrid CIP-30 wrapper
        connectedApi = await initialApi.enable();
      } else {
        throw new Error('Injected wallet does not support the Midnight DApp connector API.');
      }

      if (!connectedApi) {
        throw new Error('Wallet connection was rejected or returned empty API.');
      }

      // Fetch addresses and configuration from ConnectedAPI
      let unshieldedAddress: string | null = null;
      let shieldedAddress: string | null = null;
      let dustAddress: string | null = null;
      let networkId: string | null = preferredNetwork;
      let nightBalance: string | null = null;
      let dustBalance: string | null = null;

      // 1. Unshielded address
      try {
        if (typeof connectedApi.getUnshieldedAddress === 'function') {
          const res = await connectedApi.getUnshieldedAddress();
          unshieldedAddress = res?.unshieldedAddress || null;
        }
      } catch (e) {
        console.warn('Failed to get unshielded address:', e);
      }

      // 2. Shielded addresses
      try {
        if (typeof connectedApi.getShieldedAddresses === 'function') {
          const res = await connectedApi.getShieldedAddresses();
          shieldedAddress = res?.shieldedAddress || null;
        }
      } catch (e) {
        console.warn('Failed to get shielded addresses:', e);
      }

      // 3. Dust address
      try {
        if (typeof connectedApi.getDustAddress === 'function') {
          const res = await connectedApi.getDustAddress();
          dustAddress = res?.dustAddress || null;
        }
      } catch (e) {
        console.warn('Failed to get dust address:', e);
      }

      // 4. Configuration / Network
      try {
        if (typeof connectedApi.getConfiguration === 'function') {
          const config = await connectedApi.getConfiguration();
          if (config?.networkId) {
            networkId = config.networkId;
          }
        }
      } catch (e) {
        console.warn('Failed to get configuration:', e);
      }

      // 5. Balances
      try {
        if (typeof connectedApi.getUnshieldedBalances === 'function') {
          const balances = await connectedApi.getUnshieldedBalances();
          if (balances) {
            const keys = Object.keys(balances);
            if (keys.length > 0) {
              const val = balances[keys[0]];
              nightBalance = (Number(val) / 1_000_000).toLocaleString();
            }
          }
        }
      } catch (e) {
        console.warn('Failed to get unshielded balances:', e);
      }

      try {
        if (typeof connectedApi.getDustBalance === 'function') {
          const dust = await connectedApi.getDustBalance();
          if (dust?.balance !== undefined) {
            dustBalance = dust.balance.toString();
          }
        }
      } catch (e) {
        console.warn('Failed to get dust balance:', e);
      }

      // Fallback display address if getUnshieldedAddress wasn't available
      const primaryAddress = unshieldedAddress || shieldedAddress || dustAddress || 'mn_addr_preprod1...';

      setState({
        isConnected: true,
        isConnecting: false,
        unshieldedAddress: primaryAddress,
        shieldedAddress,
        dustAddress,
        networkId,
        nightBalance: nightBalance || '0',
        dustBalance: dustBalance || '0',
        walletName: initialApi.name || 'Lace (Midnight)',
        walletIcon: initialApi.icon || null,
        error: null,
        api: connectedApi,
      });
    } catch (err: any) {
      console.error('Wallet connection error:', err);
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isConnected: false,
        error: err?.message || 'Failed to connect Midnight wallet.',
      }));
    }
  };

  const disconnectWallet = () => {
    setState({
      isConnected: false,
      isConnecting: false,
      unshieldedAddress: null,
      shieldedAddress: null,
      dustAddress: null,
      networkId: null,
      nightBalance: null,
      dustBalance: null,
      walletName: null,
      walletIcon: null,
      error: null,
      api: null,
    });
  };

  return {
    ...state,
    address: state.unshieldedAddress,
    availableWallets,
    connectWallet,
    disconnectWallet,
  };
}
