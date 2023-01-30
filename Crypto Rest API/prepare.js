let { connectToDb } = require("./db");

let connection;
connectToDb((e) => {
  connection = e;
});

console.log(connection);

const fs = require("fs").promises;

const axios = require("axios");
let key = "be6b91ee-5fed-4f91-adb8-43075d231f74";

async function main() {
  let onAllApiEndpoints = [];

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

  let coinmarketcapSymbols = [];
  for (let e of coinmarketcap.data.data) {
    coinmarketcapSymbols.push(e.symbol);
  }
  console.log(coinmarketcapSymbols);

  let coinbaseSymbols = [];
  console.log(coinbase.data.data.rates);
  for (let e in coinbase.data.data.rates) {
    console.log(e);
    coinbaseSymbols.push(e);
  }
  console.log(coinbaseSymbols);

  let kucoinSymbols = [];
  for (let e of kucoin.data.data.ticker) {
    if (e.symbol.split("-")[1] === "USDT") {
      kucoinSymbols.push(e.symbol.split("-")[0]);
    }
  }
  console.log(kucoinSymbols);

  let coinstatsSymbols = [];
  for (let e of coinstats.data.coins) {
    coinstatsSymbols.push(e.symbol);
  }
  console.log(coinstatsSymbols);

  let coinpaprikaSymbols = [];
  for (let e of coinpaprika.data) {
    coinpaprikaSymbols.push(e.symbol);
  }
  console.log(coinpaprikaSymbols);

  let counter = 0;
  for (let e of coinmarketcapSymbols) {
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
        await fs.writeFile(
          "onAllAPIEndpoints.txt",
          JSON.stringify(onAllApiEndpoints)
        );
        break;
      }
    }
  }

  let markets = [
    "coinmarketcap",
    "coinbase",
    "kucoin",
    "coinstats",
    "coinpaprika",
  ];
  for (let symbol of onAllApiEndpoints) {
    for (let market of markets) {
      await connection.execute(
        `CREATE TABLE IF NOT EXISTS ${market}_${symbol} (
                id int AUTO_INCREMENT,
                price Decimal(40,20),
                added TIMESTAMP,
                PRIMARY KEY(id)
                ); `
      );
    }
  }
  console.log("Done");
}

main();
