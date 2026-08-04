import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-only JSON-RPC proxy.
 *
 * The browser talks to `/api/rpc/ethereum`, `/api/rpc/base` and `/api/rpc/solana`;
 * the upstream provider URLs and their API keys exist only in this server-side
 * module and are never shipped to the client.
 */
const UPSTREAM_URLS = {
  ethereum: 'https://eth-mainnet.g.alchemy.com/v2/s7CeyKmVLqakDSUUQh0Bl',
  base: 'https://base-mainnet.g.alchemy.com/v2/s7CeyKmVLqakDSUUQh0Bl',
  solana: 'https://mainnet.helius-rpc.com/?api-key=a65695d5-0b9d-45e1-a53f-4b69cc11f62c',
} as const;

type SupportedChain = keyof typeof UPSTREAM_URLS;

const MAX_BODY_BYTES = 128 * 1024;
const UPSTREAM_TIMEOUT_MS = 15_000;

const isSupportedChain = (chain: string): chain is SupportedChain =>
  Object.prototype.hasOwnProperty.call(UPSTREAM_URLS, chain);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chain: string }> },
) {
  const { chain } = await params;

  if (!isSupportedChain(chain)) {
    return NextResponse.json({ error: 'Unsupported chain' }, { status: 404 });
  }

  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
  }

  const body = await request.text();

  if (Buffer.byteLength(body) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request body too large' }, { status: 413 });
  }

  try {
    const upstream = await fetch(UPSTREAM_URLS[chain], {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      cache: 'no-store',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    const payload = await upstream.text();

    return new NextResponse(payload, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'application/json',
        'cache-control': 'no-store',
      },
    });
  } catch {
    // Never surface the upstream URL or the API key in the error path.
    return NextResponse.json({ error: 'Upstream RPC request failed' }, { status: 502 });
  }
}
