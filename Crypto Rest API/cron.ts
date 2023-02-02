const cron = require("node-cron");
import env from "dotenv";
env.config()

import fs from "fs";
import axios from "axios";

import  { connectToDb, connection } from "./db";
import { onAllApiEndpoints } from "./prepare";


const key = process.env.key;

async function main() {

  console.log("connection in cron.js", Boolean(connection));
  const onAllAPIEndpoints = onAllApiEndpoints

  const [coinmarketcap, coinbase, kucoin, coinpaprika, coinstats] =
    await Promise.all([
      axios.get(
        " https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=200", //?limit=5000", // 5000 25 credits
        {
          headers: {
            "X-CMC_PRO_API_KEY": key,
          },
        }
      ),
      axios.get(` https://api.coinbase.com/v2/exchange-rates?currency=USD`),
      axios.get(`https://api.kucoin.com/api/v1/market/allTickers`),
      axios.get("https://api.coinpaprika.com/v1/tickers"),
      axios.get(
        ` https://api.coinstats.app/public/v1/coins?skip=0&limit=200&currency=USD`
      ),
    ]);

  for (const e of coinmarketcap.data.data) {
    if (onAllAPIEndpoints.includes(e.symbol)) {
      //   console.log(e.symbol, e.quote.USD.price);
      await connection.execute(
        `Insert into coinmarketcap_${e.symbol} (price, added) values(${e.quote.USD.price}, NOW())`
      );
    }
  }
  console.log("coinmarketcap is done");

  for (const e of kucoin.data.data.ticker) {
    if (
      onAllAPIEndpoints.includes(e.symbol.split("-")[0]) &&
      e.symbol.split("-")[1] === "USDT"
    ) {
      //   console.log(e.symbol, e.last);
      await connection.execute(
        `Insert into kucoin_${e.symbol.split("-")[0]} (price, added) values(${
          e.last
        }, NOW())`
      );
    }
  }
  console.log("kucoin is done");

  for (const e in coinbase.data.data.rates) {
    if (onAllAPIEndpoints.includes(e)) {
      //   console.log(e.symbol, e.quote.USD.price);
      await connection.execute(
        `Insert into coinbase_${e} (price, added) values(${
          1 / coinbase.data.data.rates[e]
        }, NOW())`
      );
    }
  }
  console.log("coinbase is done");

  for (const e of coinstats.data.coins) {
    if (onAllAPIEndpoints.includes(e.symbol)) {
      await connection.execute(
        `Insert into coinstats_${e.symbol} (price, added) values(${e.price}, NOW())`
      );
    }
  }
  console.log("coinstats is done");

  for (const e of coinpaprika.data) {
    if (onAllAPIEndpoints.includes(e.symbol)) {
      await connection.execute(
        `Insert into coinpaprika_${e.symbol} (price, added) values(${e.quotes.USD.price}, NOW())`
      );
    }
  }
  console.log("coinpaprika is done");
}
export async function schedule() {
  cron.schedule("*/5 * * * *", main);
}

