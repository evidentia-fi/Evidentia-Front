import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-only JSON-RPC proxy.
 *
 * Mirrors `apps/app/app/api/rpc/[chain]/route.ts`: the shared wagmi config points
 * its Ethereum/Base transports at same-origin `/api/rpc/*`, so every app mounting
 * that config needs its own copy of this route. The upstream Alchemy URL and its
 * API key exist only in this server-side module and are never shipped to the client.
 */
const UPSTREAM_URLS = {
  ethereum: 'https://eth-mainnet.g.alchemy.com/v2/s7CeyKmVLqakDSUUQh0Bl',
  base: 'https://base-mainnet.g.alchemy.com/v2/s7CeyKmVLqakDSUUQh0Bl',
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
