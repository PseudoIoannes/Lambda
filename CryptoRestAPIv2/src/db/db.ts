import { drizzle } from 'drizzle-orm/mysql2/index.js';
import {
  InferModel,
  MySqlRawQueryResult,
  MySqlQueryResult,
} from 'drizzle-orm/mysql-core';
import env from 'dotenv';
import mysql from 'mysql2/promise';
import { sql } from 'drizzle-orm/sql/index.js';
import { crypto } from './schema.js';

env.config();

export type CryptoEntry = InferModel<typeof crypto>; // return type when queried
export type NewCryptoEntry = InferModel<typeof crypto, 'insert'>; // insert type

const {
  password, host, user, database,
} = process.env;

// create the connection
const poolConnection = mysql.createPool({
  host,
  user,
  database,
  password,
});

const db = drizzle(poolConnection);

export async function insertSymbol(
  entry: NewCryptoEntry,
): Promise<MySqlRawQueryResult> {
  return db.insert(crypto).values(entry);
}

export async function selectSymbol(
  symbol: string,
  timeInMinutes: number,
  market?: string,
) {
  const normalizedSymbol = symbol.toUpperCase();
  if (market) {
    const normalizedMarket = market.toLowerCase();
    const answer: MySqlQueryResult<CryptoEntry> = await db.execute<CryptoEntry>(
      sql`select * from crypto where symbol = ${normalizedSymbol} and market = ${normalizedMarket} and added >= DATE_SUB(now(),INTERVAL ${timeInMinutes} minute);`,
    );
    return answer;
  }
  const answer: MySqlQueryResult<CryptoEntry> = await db.execute<CryptoEntry>(
    sql`select * from crypto where symbol = ${normalizedSymbol} and added >= DATE_SUB(now(),INTERVAL ${timeInMinutes} minute);`,
  );
  return answer;
}
