import axios from 'axios';
import env from 'dotenv';

import {
  CoinbaseListResponse,
  CoinmarketcapListResponse,
  CoinpaprikaListResponse,
  CoinstatsListResponse,
  KucoinListResponse,
  Symbol,
} from './interfaces/exchangesResponses';

env.config();
const { key } = process.env;

// export default async function getSymbolsOnAllEndpoints() {
export async function getRawSymbolsOnCoinmarketcap() {
  const coinmarketcap = await axios.get<CoinmarketcapListResponse>(
    ' https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=200', // ?limit=5000", // 5000 25 credits
    {
      headers: {
        'X-CMC_PRO_API_KEY': key,
      },
    },
  );

  const coinmarketcapRawSymbols = coinmarketcap.data.data;
  return coinmarketcapRawSymbols;
}

async function getRawSymbolsOnCoinbase() {
  const coinbase = await axios.get<CoinbaseListResponse>(
    'https://api.coinbase.com/v2/exchange-rates?currency=USD',
  );
  const coinbaseRawSymbols = coinbase.data.data.rates;
  return coinbaseRawSymbols;
}

async function getRawSymbolsOnKucoin() {
  const kucoin = await axios.get<KucoinListResponse>(
    'https://api.kucoin.com/api/v1/market/allTickers',
  );
  const kucoinRawSymbols = kucoin.data.data.ticker;
  return kucoinRawSymbols;
}

async function getRawSymbolsOnCoinstats() {
  const coinstats = await axios.get<CoinstatsListResponse>(
    'https://api.coinstats.app/public/v1/coins?skip=0&limit=200&currency=USD',
  );
  const coinstatsRawSymbols = coinstats.data.coins;
  return coinstatsRawSymbols;
}

async function getRawSymbolsOnCoinpaprika() {
  const coinpaprika = await axios.get<CoinpaprikaListResponse>(
    'https://api.coinpaprika.com/v1/tickers',
  );
  const coinpaprikaRawSymbols = coinpaprika.data;
  return coinpaprikaRawSymbols;
}

export async function getSymbols(supportedSymbols: string[]) {
  let [
    coinmarketcapRawSymbols,
    coinbaseRawSymbols,
    kucoinRawSymbols,
    coinstatsRawSymbols,
    coinpaprikaRawSymbols,
  ] = await Promise.all([
    getRawSymbolsOnCoinmarketcap(),
    getRawSymbolsOnCoinbase(),
    getRawSymbolsOnKucoin(),
    getRawSymbolsOnCoinstats(),
    getRawSymbolsOnCoinpaprika(),
  ]);

  // eslint-disable-next-line max-len
  coinmarketcapRawSymbols = coinmarketcapRawSymbols.filter((e) => supportedSymbols.includes(e.symbol));

  let coinbaseKeys = Object.keys(coinbaseRawSymbols);
  coinbaseKeys = coinbaseKeys.filter((e) => supportedSymbols.includes(e));

  kucoinRawSymbols = kucoinRawSymbols.filter((e) => {
    const splittedSymbol = e.symbol.split('-');
    return (
      splittedSymbol[1] === 'USDT'
      && supportedSymbols.includes(splittedSymbol[0])
    );
  });

  coinstatsRawSymbols = coinstatsRawSymbols.filter((e) => supportedSymbols.includes(e.symbol));
  coinpaprikaRawSymbols = coinpaprikaRawSymbols.filter((e) => supportedSymbols.includes(e.symbol));

  const coinmarketcapSymbols = coinmarketcapRawSymbols.reduce((acc, curr) => {
    acc.push([curr.symbol, curr.quote.USD.price, 'coinmarketcap']);
    return acc;
  }, <Symbol>[]);

  const coinbaseSymbols = coinbaseKeys.reduce((acc, curr) => {
    const price = +coinbaseRawSymbols[curr];
    acc.push([curr, 1 / price, 'coinbase']);
    return acc;
  }, <Symbol>[]);

  const kucoinSymbols = kucoinRawSymbols.reduce((acc, curr) => {
    const splittedSymbol = curr.symbol.split('-');
    acc.push([splittedSymbol[0], +curr.last, 'kucoin']);
    return acc;
  }, <Symbol>[]);

  const coinstatsSymbols = coinstatsRawSymbols.reduce((acc, curr) => {
    acc.push([curr.symbol, curr.price, 'coinstats']);
    return acc;
  }, <Symbol>[]);

  const coinpaprikaSymbols = coinpaprikaRawSymbols.reduce((acc, curr) => {
    acc.push([curr.symbol, curr.quotes.USD.price, 'coinpaprika']);
    return acc;
  }, <Symbol>[]);

  return coinmarketcapSymbols.concat(
    coinbaseSymbols,
    kucoinSymbols,
    coinstatsSymbols,
    coinpaprikaSymbols,
  );
}

export async function getSymbolsOnAllEndpoints() {
  const [
    coinmarketcapRawSymbols,
    coinbaseRawSymbols,
    kucoinRawSymbols,
    coinstatsRawSymbols,
    coinpaprikaRawSymbols,
  ] = await Promise.all([
    getRawSymbolsOnCoinmarketcap(),
    getRawSymbolsOnCoinbase(),
    getRawSymbolsOnKucoin(),
    getRawSymbolsOnCoinstats(),
    getRawSymbolsOnCoinpaprika(),
  ]);
  const coinmarketcapSymbols = coinmarketcapRawSymbols.reduce((acc, curr) => {
    acc.push(curr.symbol);
    return acc;
  }, <Array<string>>[]);

  const coinbaseSymbols = Object.keys(coinbaseRawSymbols);

  const kucoinSymbols = kucoinRawSymbols.reduce((acc, curr) => {
    const splittedSymbol = curr.symbol.split('-');
    if (splittedSymbol[1] === 'USDT') {
      acc.push(splittedSymbol[0]);
    }
    return acc;
  }, <Array<string>>[]);

  const coinstatsSymbols = coinstatsRawSymbols.reduce((acc, curr) => {
    acc.push(curr.symbol);
    return acc;
  }, <Array<string>>[]);

  const coinpaprikaSymbols = coinpaprikaRawSymbols.reduce((acc, curr) => {
    acc.push(curr.symbol);
    return acc;
  }, <Array<string>>[]);

  const symbolsOnAllEndpoints = coinmarketcapSymbols.reduce((acc, curr) => {
    if (
      coinbaseSymbols.includes(curr)
      && kucoinSymbols.includes(curr)
      && coinstatsSymbols.includes(curr)
      && coinpaprikaSymbols.includes(curr)
    ) {
      acc.push(curr);
    }
    return acc;
  }, <Array<string>>[]);

  console.log('symbolsOnAllEndpoints:', symbolsOnAllEndpoints.length);
  return symbolsOnAllEndpoints;
}
export const symbolsOnAllEndpoints = await getSymbolsOnAllEndpoints();
