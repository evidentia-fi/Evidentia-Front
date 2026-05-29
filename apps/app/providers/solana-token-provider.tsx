'use client';

import { PropsWithChildren, useCallback, useEffect } from 'react';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from '@solana/spl-token';
import { ComputeBudgetProgram, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { oft } from '@layerzerolabs/oft-v2-solana-sdk';
import { Options } from '@layerzerolabs/lz-v2-utilities';
import {
  type AddressLookupTableInput,
  type WrappedInstruction,
  publicKey as umiPublicKey,
  transactionBuilder,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { type Address, formatUnits, hexToBytes, pad, parseUnits } from 'viem';

import { chains } from '@/providers/bridge-provider';

import { useSolanaToken } from '@workspace/ui/stores/use-solana';

import { env } from '@workspace/utils/config';

// Convert a web3.js TransactionInstruction to a UMI WrappedInstruction.
// Avoids adding umi-web3js-adapters as a direct dependency.
function toWrapped(ix: TransactionInstruction): WrappedInstruction {
  return {
    instruction: {
      keys: ix.keys.map(k => ({
        pubkey: umiPublicKey(k.pubkey.toBase58()),
        isSigner: k.isSigner,
        isWritable: k.isWritable,
      })),
      programId: umiPublicKey(ix.programId.toBase58()),
      data: Uint8Array.from(ix.data),
    },
    signers: [],
    bytesCreatedOnChain: 0,
  };
}

export const SolanaTokenProvider = ({ children }: PropsWithChildren) => {
  const { connection } = useConnection();
  const {
    publicKey,
    connected,
    signTransaction,
    signAllTransactions,
    signMessage,
  } = useWallet();

  const { set: setSolanaTokenState, reset: resetSolanaTokenState } = useSolanaToken(s => ({
    set: s.set,
    reset: s.reset,
  }));

  const refetch = useCallback(async () => {
    if (!connected || !publicKey) {
      return;
    }

    if (!env.SOLANA_RPC_URL) {
      console.error('[SolanaTokenProvider] NEXT_PUBLIC_SOLANA_RPC_URL is not set. Cannot fetch Solana balances.');
      setSolanaTokenState({ solBalance: '0', tokenBalance: '0' });
      return;
    }

    try {
      const lamports = await connection.getBalance(publicKey);
      const solBalance = formatUnits(BigInt(lamports), 9);
      setSolanaTokenState({ solBalance });
    } catch (error) {
      console.error('[SolanaTokenProvider] Failed to fetch SOL balance:', error);
      setSolanaTokenState({ solBalance: '0' });
    }

    if (!env.SOLANA_MINT) {
      console.error('[SolanaTokenProvider] NEXT_PUBLIC_SOLANA_MINT is not set. Cannot fetch UAHe balance.');
      setSolanaTokenState({ tokenBalance: '0', decimals: 6 });
      return;
    }

    try {
      const mint = new PublicKey(env.SOLANA_MINT);
      const ata = getAssociatedTokenAddressSync(mint, publicKey);
      const { value } = await connection.getTokenAccountBalance(ata);
      setSolanaTokenState({
        tokenBalance: value.uiAmountString ?? '0',
        decimals: value.decimals,
      });
    } catch {
      setSolanaTokenState({ tokenBalance: '0', decimals: 6 });
    }
  }, [publicKey, connected, connection, setSolanaTokenState]);

  useEffect(() => {
    if (connected && publicKey) {
      void refetch();
    } else {
      resetSolanaTokenState();
    }
  }, [connected, publicKey, refetch, resetSolanaTokenState]);

  useEffect(() => {
    const handleBridgeToEvm = async ({
      toAddress,
      amount,
      toChain,
    }: {
      toAddress: string;
      amount: string;
      toChain: string;
    }) => {
      if (!publicKey || !connected) throw new Error('Solana wallet not connected');
      if (!env.SOLANA_RPC_URL) throw new Error('Solana RPC URL not configured');
      if (!env.SOLANA_MINT) throw new Error('Solana MINT not configured');
      if (!env.SOLANA_ESCROW) throw new Error('Solana ESCROW not configured');
      if (!env.SOLANA_OFT_PROGRAM_ID) throw new Error('Solana OFT program not configured');
      if (!env.SOLANA_SEND_ALT) throw new Error('Solana Send ALT not configured');

      if (toChain === 'Tron') throw new Error('Solana → Tron bridge is not supported');
      if (!env.OFT_ADAPTER) throw new Error('OFT adapter not configured');

      const chainConfig = chains[toChain];
      if (!chainConfig) throw new Error(`Unsupported destination chain: ${toChain}`);

      // UAHe: 6 decimals on both chains
      const amountLd = parseUnits(amount, 6);

      // Derive source ATA
      const mintPubkey = new PublicKey(env.SOLANA_MINT);
      const ata = getAssociatedTokenAddressSync(mintPubkey, publicKey);

      // EVM recipient: left-padded 20 bytes → bytes32
      const toBytes32: Uint8Array = hexToBytes(pad(toAddress as Address, { size: 32 }));

      // peerAddr: leftPad32(OFT_ADAPTER)
      const peerAddr: Uint8Array = hexToBytes(pad(env.OFT_ADAPTER, { size: 32 }));

      // Options: 80k gas for Solana → EVM
      const options: Uint8Array = Options.newOptions()
        .addExecutorLzReceiveOption(80_000, 0)
        .toBytes();

      // UMI instance with connected wallet as identity + payer
      const walletAdapter = { publicKey, signTransaction, signAllTransactions, signMessage };
      const umi = createUmi(env.SOLANA_RPC_URL).use(walletAdapterIdentity(walletAdapter));

      // lz-solana-sdk-v2 internally calls toWeb3Connection(rpc) which requires
      // rpc instanceof Connection OR rpc.connection instanceof Connection.
      // umi.rpc is neither — attach the web3.js Connection so the check passes.
      (umi.rpc as any).connection = connection;

      // Programs (oft302 — SDK default export)
      const programs = {
        oft: umiPublicKey(env.SOLANA_OFT_PROGRAM_ID),
        token: umiPublicKey(TOKEN_PROGRAM_ID.toBase58()),
      };

      // Quote
      const quoteParams = {
        dstEid: chainConfig.eid,
        to: toBytes32,
        amountLd,
        minAmountLd: amountLd,
        options,
        payInLzToken: false,
      };

      // oft.quote / oft.send expect @metaplex-foundation/umi@^0.9.2 types.
      // Our UMI instance is created by umi-bundle-defaults@1.5.1 (umi@^1.5.1).
      // The two versions are runtime-compatible but TypeScript branded types differ.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { nativeFee } = (await (oft.quote as any)(
        umi.rpc,
        {
          payer: umi.identity.publicKey,
          tokenMint: umiPublicKey(env.SOLANA_MINT),
          tokenEscrow: umiPublicKey(env.SOLANA_ESCROW),
          peerAddr,
        },
        quoteParams,
        programs,
      )) as { nativeFee: bigint; lzTokenFee: bigint };

      // Build OFT send instruction
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sendIx = (await (oft.send as any)(
        umi.rpc,
        {
          payer: umi.identity,
          tokenMint: umiPublicKey(env.SOLANA_MINT),
          tokenEscrow: umiPublicKey(env.SOLANA_ESCROW),
          tokenSource: umiPublicKey(ata.toBase58()),
          peerAddr,
        },
        { ...quoteParams, nativeFee },
        programs,
      )) as WrappedInstruction;

      // Compute budget: unit limit + priority fee
      const recentFees = await connection.getRecentPrioritizationFees();
      const priorityRate =
        recentFees.length > 0
          ? Math.ceil(
              recentFees.reduce((s, f) => s + f.prioritizationFee, 0) / recentFees.length,
            )
          : 1000;

      const cuLimitIx = toWrapped(ComputeBudgetProgram.setComputeUnitLimit({ units: 800_000 }));
      const cuPriceIx = toWrapped(
        ComputeBudgetProgram.setComputeUnitPrice({ microLamports: priorityRate }),
      );

      // Load shared ALT (required — DVN send exceeds legacy tx size limit)
      const altResult = await connection.getAddressLookupTable(
        new PublicKey(env.SOLANA_SEND_ALT),
      );
      const alt = altResult.value;
      if (!alt) throw new Error('Address Lookup Table not found');

      const umiAlt: AddressLookupTableInput = {
        publicKey: umiPublicKey(alt.key.toBase58()),
        addresses: alt.state.addresses.map(addr => umiPublicKey(addr.toBase58())),
      };

      // Build v0 versioned transaction and send
      await transactionBuilder()
        .add(cuLimitIx)
        .add(cuPriceIx)
        .add(sendIx)
        .useV0()
        .setAddressLookupTables([umiAlt])
        .sendAndConfirm(umi);

      await refetch();
    };

    setSolanaTokenState({ handleBridgeToEvm, refetch });
  }, [
    publicKey,
    connected,
    signTransaction,
    signAllTransactions,
    signMessage,
    connection,
    refetch,
    setSolanaTokenState,
  ]);

  return children;
};
