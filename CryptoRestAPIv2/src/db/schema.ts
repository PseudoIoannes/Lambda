import {
  mysqlTable,
  serial,
  decimal,
  timestamp,
  mysqlEnum,
} from 'drizzle-orm/mysql-core/index.js';
import { symbolsOnAllEndpoints } from '../exchanges.js';

export function getSymbolsEnum(symbols: string[]) {
  if (symbols.length <= 1) {
    throw Error('Not enough elements for enum');
  }
  const firstSymbol = symbols[0];
  symbols.splice(0, 1);
  const symbolsEnum: readonly [string, ...string[]] = [firstSymbol, ...symbols];
  return symbolsEnum;
}

export const crypto = mysqlTable('crypto', {
  id: serial('id').primaryKey(),
  symbol: mysqlEnum('symbol', getSymbolsEnum(symbolsOnAllEndpoints)).notNull(),
  price: decimal('price', { precision: 40, scale: 20 }).notNull(),
  market: mysqlEnum('market', [
    'coinmarketcap',
    'coinbase',
    'kucoin',
    'coinstats',
    'coinpaprika',
  ]).notNull(),
  added: timestamp('added').notNull().defaultNow(),
});
