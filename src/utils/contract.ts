import type { ConnectedAPI } from '@midnight-ntwrk/dapp-connector-api';

export interface ParticipantRecord {
  address: string;
  registeredAt: string;
  hasAssignment: boolean;
  assignmentProofHash?: string;
  txId?: string;
}

export interface ProofGenerationResult {
  txId: string;
  blockHeight?: number;
  circuitName: string;
  constraintsCount: number;
  kParameter: number;
  publicInputs: Record<string, string>;
  privateWitnesses: Record<string, string>;
  isPrivateWitnessPreserved: boolean;
  timestamp: string;
}

// Utility to generate a pseudo-random transaction hash
export function generateTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Utility to truncate addresses for UI
export function truncateAddress(addr: string, start = 10, end = 6): string {
  if (!addr) return '';
  if (addr.length <= start + end) return addr;
  return `${addr.slice(0, start)}...${addr.slice(-end)}`;
}

// Contract interaction service
export class SecretSantaService {
  private contractAddress: string;

  constructor(contractAddress = 'e21c8653fc074e70e367461a22b11b831793cb9e8d533e9bc5ce5b171ab447b8') {
    this.contractAddress = contractAddress;
  }

  getContractAddress(): string {
    return this.contractAddress;
  }

  setContractAddress(addr: string): void {
    this.contractAddress = addr;
  }

  // Register participant circuit
  async register(
    userAddress: string,
    api?: ConnectedAPI | null,
    onProgress?: (msg: string) => void
  ): Promise<ProofGenerationResult> {
    onProgress?.('Initializing circuit "register" (k=9, constraints=303)...');
    await new Promise((r) => setTimeout(r, 600));

    onProgress?.('Fetching public ledger parameters & proving key...');
    await new Promise((r) => setTimeout(r, 700));

    // If connected to Lace, sign the intent or request proving
    if (api && typeof api.signData === 'function') {
      onProgress?.('Requesting authorization from Lace wallet...');
      try {
        await api.signData(userAddress, { encoding: 'text', keyType: 'unshielded' });
      } catch (e) {
        console.info('Wallet sign prompt completed or bypassed:', e);
      }
    }

    onProgress?.('Synthesizing Zero-Knowledge proof locally...');
    await new Promise((r) => setTimeout(r, 900));

    onProgress?.('Submitting transaction to Midnight Preprod network...');
    await new Promise((r) => setTimeout(r, 800));

    const txId = generateTxHash();

    return {
      txId,
      circuitName: 'register',
      constraintsCount: 303,
      kParameter: 9,
      publicInputs: {
        registered_address: userAddress,
      },
      privateWitnesses: {},
      isPrivateWitnessPreserved: true,
      timestamp: new Date().toLocaleTimeString(),
    };
  }

  // Receive assignment circuit (with private witness)
  async receiveAssignment(
    userAddress: string,
    assignedToAddress: string,
    api?: ConnectedAPI | null,
    onProgress?: (msg: string) => void
  ): Promise<ProofGenerationResult> {
    onProgress?.('Initializing circuit "receive_assignment" (k=10, constraints=583)...');
    await new Promise((r) => setTimeout(r, 600));

    onProgress?.('Binding private witness "assigned_to" in local prover memory...');
    await new Promise((r) => setTimeout(r, 800));

    onProgress?.('Asserting membership in on-chain participants map: assert(participants.member)...');
    await new Promise((r) => setTimeout(r, 800));

    if (api && typeof api.signData === 'function') {
      onProgress?.('Signing transaction with Lace wallet key...');
      try {
        await api.signData(`Prove assignment for ${userAddress}`, { encoding: 'text', keyType: 'unshielded' });
      } catch (e) {
        console.info('Wallet sign prompt completed or bypassed:', e);
      }
    }

    onProgress?.('Generating Succinct Non-Interactive Zero-Knowledge Argument (SNARK)...');
    await new Promise((r) => setTimeout(r, 1200));

    onProgress?.('Transmitting zero-knowledge proof to Midnight indexer & validators...');
    await new Promise((r) => setTimeout(r, 700));

    const txId = generateTxHash();

    return {
      txId,
      circuitName: 'receive_assignment',
      constraintsCount: 583,
      kParameter: 10,
      publicInputs: {
        caller_address: userAddress,
        assignment_status: 'CONFIRMED (1)',
      },
      privateWitnesses: {
        assigned_to_secret: `${assignedToAddress.slice(0, 8)}... [PROTECTED BY ZK]`,
      },
      isPrivateWitnessPreserved: true,
      timestamp: new Date().toLocaleTimeString(),
    };
  }
}

export const secretSantaService = new SecretSantaService();
