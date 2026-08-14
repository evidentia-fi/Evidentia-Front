import { injected, walletConnect } from '@wagmi/connectors';
import { Config, CreateConnectorFn, cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { Chain, base, mainnet, sepolia } from 'wagmi/chains';

// Resolved against `window.location` in the browser, empty during SSR. WalletConnect only
// ever runs client-side, so the fallbacks below are never used by a real pairing.
const appOrigin = typeof window === 'undefined' ? '' : window.location.origin;

export const metadata = {
  name: 'Evidentia',
  description: 'Evidentia: Bridging TradFi and DeFi Through Bond Tokenization',
  // Wallets compare `metadata.url` against the real browser origin (Verify API). A
  // hardcoded apex URL makes every deployment on a subdomain look like a domain mismatch.
  url: appOrigin || 'https://evidentia.fi',
  icons: ['https://ua.evidentia.fi/logo.svg'],
};

export const isTestnet = process.env['NEXT_PUBLIC_ENV'] === 'testnet';
export const projectId = process.env['NEXT_PUBLIC_REOWN_PROJECT_ID'] ?? '';

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const ethNetwork: Chain = isTestnet ? sepolia : mainnet;

const chains: readonly [Chain, ...Chain[]] = [mainnet, base];

const walletConnectConnector = walletConnect({
  customStoragePrefix: 'wagmi',
  projectId,
  metadata,
  qrModalOptions: {
    themeMode: 'light',
  },
});

const injectedConnector = injected({
  shimDisconnect: false,
});

// `createConfig()` calls `connector.setup()` synchronously, and WalletConnect's setup boots
// its Core, which opens IndexedDB — unavailable in the Next server runtime. A connector is
// useless while prerendering anyway: nothing can pair with a wallet there, `WalletConnectModal`
// (the only reader of `connectors`) is never rendered on the server, and wagmi performs its
// reconnect from a browser-only effect (`Hydrate` gates `onMount()` behind `useEffect` when
// `ssr: true`). Everything else about the config stays identical in both runtimes.
const connectors: CreateConnectorFn[] =
  typeof window === 'undefined' ? [injectedConnector] : [injectedConnector, walletConnectConnector];

const config = createConfig({
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    // Same-origin proxy routes: the provider URL and its API key stay server-side.
    // The WalletConnect connector reuses these transports to build the session `rpcMap`
    // (`@wagmi/connectors` -> `extractRpcUrls`), and `@walletconnect/jsonrpc-http-connection`
    // throws on anything that is not an absolute http(s) URL. A bare `/api/rpc/...` therefore
    // breaks the connection right after the wallet approves it, so the origin is prefixed here.
    [mainnet.id]: http(`${appOrigin}/api/rpc/ethereum`),
    [base.id]: http(`${appOrigin}/api/rpc/base`),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
  chains,
  connectors,
});

export const wagmiConfig = config as Config;
