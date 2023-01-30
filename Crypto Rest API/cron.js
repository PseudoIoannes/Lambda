const cron = require("node-cron");

const fs = require("fs").promises;
const axios = require("axios");

let { connectToDb } = require("./db");

let connection;
connectToDb((e) => {
  connection = e;
});

console.log(connection);

let key = "be6b91ee-5fed-4f91-adb8-43075d231f74";

cron.schedule("*/5 * * * *", main);

async function main() {
  //   try {
  const onAllAPIEndpointsStr = await fs.readFile(
    "onAllAPIEndpoints.txt",
    "utf-8"
  );
  const onAllAPIEndpoints = await JSON.parse(onAllAPIEndpointsStr);
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   try {
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
  //   } catch (e) {
  //     console.log(e);
  //   }

  //   try {
  //   console.log(onAllAPIEndpoints);
  for (let e of coinmarketcap.data.data) {
    if (onAllAPIEndpoints.includes(e.symbol)) {
      //   console.log(e.symbol, e.quote.USD.price);
      await connection.execute(
        `Insert into coinmarketcap_${e.symbol} (price, added) values(${e.quote.USD.price}, NOW())`
      );
    }
  }
  console.log("coinmarketcap is done");

  for (let e of kucoin.data.data.ticker) {
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

  for (let e in coinbase.data.data.rates) {
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

  for (let e of coinstats.data.coins) {
    if (onAllAPIEndpoints.includes(e.symbol)) {
      //   console.log(e.symbol);
      //   console.log(e.symbol, e.quote.USD.price);
      await connection.execute(
        `Insert into coinstats_${e.symbol} (price, added) values(${e.price}, NOW())`
      );
    }
  }
  console.log("coinstats is done");

  for (let e of coinpaprika.data) {
    // console.log(e);
    if (onAllAPIEndpoints.includes(e.symbol)) {
      await connection.execute(
        `Insert into coinpaprika_${e.symbol} (price, added) values(${e.quotes.USD.price}, NOW())`
      );
    }
  }
  console.log("coinpaprika is done");

  //   } catch (e) {
  //     console.log(e);
  //   }
}
