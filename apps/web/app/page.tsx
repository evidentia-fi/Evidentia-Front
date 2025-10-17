'use client';

import Image from 'next/image';

import Banner from '@workspace/ui/components/banner';
import Container from '@workspace/ui/components/container';
import Marquee from '@workspace/ui/components/marquee';

const tickers = [
  'GB3:GOV',
  'GB6:GOV',
  'GTGBP2Y:GOV',
  'GTGBP5Y:GOV',
  'GTJPY2Y:GOV',
  'BATS:GOVT',
  'FRA:SXRQ',
  'NYSEARCA:SGOV',
  'NASDAQ:TLT',
  'NASDAQ:VGSH',
  'NASDAQ:VGIT',
  'GTDEM2Y:GOV',
  'GTDEM5Y:GOV',
  'GTAUD2Y:GOV',
  'GTAUD5Y:GOV',
];

const tokens = [
  { title: 'Ethereum', image: 'eth' },
  { title: 'Tron', image: 'tron' },
  { title: 'TON', image: 'ton' },
  { title: 'Solana', image: 'solana' },
  { title: 'Whitechain', image: 'whitechain' },
];

export default function Page() {
  return (
    <>
      <Banner
        title='Evidentia: Bridging TradFi & DeFi'
        description='Unlock Real Yield with Bond-Backed Stablecoins.'
        quote='“Tokenising the Future of Finance”'
      />
      <Marquee className={'gap-5'}>
        <div className='flex items-center gap-5'>
          {tickers.map(ticker => (
            <span key={ticker}>{ticker}</span>
          ))}
        </div>
      </Marquee>
      <Container className='pb-14 pt-10 md:pb-[104px] md:pt-14'>
        <h2 className='mb-6 text-3xl font-bold text-white md:mb-10 md:text-5xl'>Powered by</h2>
        <div className='grid gap-6 md:grid-cols-5 lg:gap-10'>
          {tokens.map(token => (
            <div
              key={token.title}
              className='flex flex-col items-center justify-center gap-4 rounded-lg border p-6 text-white md:p-10'
            >
              <Image src={`/tokens/${token.image}.svg`} alt={token.image} width={64} height={64} />
              <h4 className='text-xl font-semibold'>{token.title}</h4>
            </div>
          ))}
        </div>
      </Container>
    </>
  );
}
