import { injected, walletConnect } from '@wagmi/connectors';
import { Config, CreateConnectorFn, cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { Chain, mainnet, sepolia, base, baseSepolia } from 'wagmi/chains';

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
export const baseNetwork: Chain = isTestnet ? baseSepolia : base;

const chains: readonly [Chain, ...Chain[]] = [ethNetwork, baseNetwork];

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
    // [mainnet.id]: http('https://rpc.ethereum.zpoken.dev'),
    [mainnet.id]: http(
      'https://alien-bold-bird.quiknode.pro/57de984adec0ce597d1f07a6aba6b2e42753ab3b/',
    ),
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [base.id]: http('https://mainnet.base.org'),
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
  multiInjectedProviderDiscovery: false,
  ssr: true,
  chains,
  connectors,
});

export const wagmiConfig = config as Config;
