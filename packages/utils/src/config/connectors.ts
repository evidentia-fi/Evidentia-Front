import { injected, walletConnect } from '@wagmi/connectors';
import { Config, CreateConnectorFn, cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { Chain, base, mainnet, sepolia } from 'wagmi/chains';

export const metadata = {
  name: 'Evidentia',
  description: 'Evidentia: Bridging TradFi and DeFi Through Bond Tokenization',
  url: 'https://evidentia.fi/',
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

const connectors: CreateConnectorFn[] = [injectedConnector, walletConnectConnector];

const config = createConfig({
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    // Same-origin proxy routes: the provider URL and its API key stay server-side.
    [mainnet.id]: http('/api/rpc/ethereum'),
    [base.id]: http('/api/rpc/base'),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
  chains,
  connectors,
});

export const wagmiConfig = config as Config;
