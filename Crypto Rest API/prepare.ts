import  { connectToDb, connection } from "./db";

import env from "dotenv";
env.config()

import fs from "fs";

import axios from "axios";
const key = process.env.key;

const onAllApiEndpoints: any[] = [];
export async function main() {
  console.log("connection in prepare.js", Boolean(connection));

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

  const coinmarketcapSymbols = [];
  for (const e of coinmarketcap.data.data) {
    coinmarketcapSymbols.push(e.symbol);
  }

  const coinbaseSymbols = [];
  for (const e in coinbase.data.data.rates) {
    coinbaseSymbols.push(e);
  }

  const kucoinSymbols = [];
  for (const e of kucoin.data.data.ticker) {
    if (e.symbol.split("-")[1] === "USDT") {
      kucoinSymbols.push(e.symbol.split("-")[0]);
    }
  }

  const coinstatsSymbols = [];
  for (const e of coinstats.data.coins) {
    coinstatsSymbols.push(e.symbol);
  }

  const coinpaprikaSymbols = [];
  for (const e of coinpaprika.data) {
    coinpaprikaSymbols.push(e.symbol);
  }

  let counter = 0;
  for (const e of coinmarketcapSymbols) {
    // console.log(e)

    if (
      coinbaseSymbols.includes(e) &&
      kucoinSymbols.includes(e) &&
      coinstatsSymbols.includes(e) &&
      coinpaprikaSymbols.includes(e)
    ) {
      counter += 1;
      console.log(counter);
      onAllApiEndpoints.push(e);
      if (counter === 50) {
        // await fs.promises.writeFile(
        //   "onAllAPIEndpoints.txt",
        //   JSON.stringify(onAllApiEndpoints)
        // );
        console.log(onAllApiEndpoints);
        break;
      }
    }
  }

  const markets = [
    "coinmarketcap",
    "coinbase",
    "kucoin",
    "coinstats",
    "coinpaprika",
  ];
  console.log(onAllApiEndpoints.length)
  for (const symbol of onAllApiEndpoints) {
    for (const market of markets) {
      try{

        await connection.execute(
          `CREATE TABLE IF NOT EXISTS ${market}_${symbol} (
            id int AUTO_INCREMENT,
            price Decimal(40,20),
            added TIMESTAMP,
            PRIMARY KEY(id)
            ); `
            );
          }catch (err){
            console.log(err)

          }
          }
  }
  console.log("Done");
}

export { onAllApiEndpoints };
