'use client';

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { WalletConnectWalletAdapter } from '@solana/wallet-adapter-walletconnect';
import { Connection } from '@solana/web3.js';

import { isTestnet, metadata, projectId } from './connectors';
import { env } from './env';

export const SOLANA_EID_MAINNET = 30168;
export const SOLANA_EID_TESTNET = 40168;

export const SOLANA_EID = isTestnet ? SOLANA_EID_TESTNET : SOLANA_EID_MAINNET;

if (isTestnet && !env.SOLANA_OFT_PROGRAM_ID) {
  console.warn(
    '[Solana] Running in testnet mode but Solana devnet env vars are not configured. ' +
      'Bridge functionality will not work until NEXT_PUBLIC_SOLANA_OFT_PROGRAM_ID, ' +
      'NEXT_PUBLIC_SOLANA_OFT_STORE, NEXT_PUBLIC_SOLANA_MINT, NEXT_PUBLIC_SOLANA_ESCROW, ' +
      'NEXT_PUBLIC_SOLANA_SEND_ALT are set.',
  );
}

const network = isTestnet ? WalletAdapterNetwork.Devnet : WalletAdapterNetwork.Mainnet;

export const solanaWallets = [
  new PhantomWalletAdapter(),
  new WalletConnectWalletAdapter({
    network,
    options: {
      projectId,
      metadata,
    },
  }),
];

export const solanaConnection = new Connection(env.SOLANA_RPC_URL, 'confirmed');
