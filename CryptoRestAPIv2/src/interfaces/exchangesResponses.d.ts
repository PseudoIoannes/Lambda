export interface CoinmarketcapListResponse {
  data: Array<{
    id: number;
    name: string;
    symbol: string;
    quote: {
      USD: {
        price: number;
      };
    };
  }>;
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
    elapsed: number;
    credit_count: number;
  };
}

export interface CoinbaseListResponse {
  data: {
    currency: string;
    rates: {
      [key: string]: string;
    };
  };
}

type HasHyphen = `${string}-${string}`;
export interface KucoinListResponse {
  data: {
    time: number;
    ticker: Array<{
      symbol: HasHyphen;
      last: string;
    }>;
  };
}

export interface CoinstatsListResponse {
  coins: {
    symbol: string;
    price: number;
  }[];
}

interface CoinpaprikaListItem {
  symbol: string;
  quotes: {
    USD: {
      price: number;
    };
  };
}
export interface CoinpaprikaListResponse extends Array<CoinpaprikaListItem> {}

export type Market =
  | 'coinmarketcap'
  | 'coinbase'
  | 'kucoin'
  | 'coinstats'
  | 'coinpaprika';

export type Symbol = Array<[string, number, Market]>;
