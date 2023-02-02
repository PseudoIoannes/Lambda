"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schedule = void 0;
const cron = require("node-cron");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const axios_1 = __importDefault(require("axios"));
const db_1 = require("./db");
const prepare_1 = require("./prepare");
const key = process.env.key;
async function main() {
    console.log("connection in cron.js", Boolean(db_1.connection));
    // const onAllAPIEndpointsStr = await fs.promises.readFile(
    //   "onAllAPIEndpoints.txt",
    //   "utf-8"
    // );
    const onAllAPIEndpoints = prepare_1.onAllApiEndpoints;
    const [coinmarketcap, coinbase, kucoin, coinpaprika, coinstats] = await Promise.all([
        axios_1.default.get(" https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=200", //?limit=5000", // 5000 25 credits
        {
            headers: {
                "X-CMC_PRO_API_KEY": key,
            },
        }),
        axios_1.default.get(` https://api.coinbase.com/v2/exchange-rates?currency=USD`),
        axios_1.default.get(`https://api.kucoin.com/api/v1/market/allTickers`),
        axios_1.default.get("https://api.coinpaprika.com/v1/tickers"),
        axios_1.default.get(` https://api.coinstats.app/public/v1/coins?skip=0&limit=200&currency=USD`),
    ]);
    for (const e of coinmarketcap.data.data) {
        if (onAllAPIEndpoints.includes(e.symbol)) {
            //   console.log(e.symbol, e.quote.USD.price);
            await db_1.connection.execute(`Insert into coinmarketcap_${e.symbol} (price, added) values(${e.quote.USD.price}, NOW())`);
        }
    }
    console.log("coinmarketcap is done");
    for (const e of kucoin.data.data.ticker) {
        if (onAllAPIEndpoints.includes(e.symbol.split("-")[0]) &&
            e.symbol.split("-")[1] === "USDT") {
            //   console.log(e.symbol, e.last);
            await db_1.connection.execute(`Insert into kucoin_${e.symbol.split("-")[0]} (price, added) values(${e.last}, NOW())`);
        }
    }
    console.log("kucoin is done");
    for (const e in coinbase.data.data.rates) {
        if (onAllAPIEndpoints.includes(e)) {
            //   console.log(e.symbol, e.quote.USD.price);
            await db_1.connection.execute(`Insert into coinbase_${e} (price, added) values(${1 / coinbase.data.data.rates[e]}, NOW())`);
        }
    }
    console.log("coinbase is done");
    for (const e of coinstats.data.coins) {
        if (onAllAPIEndpoints.includes(e.symbol)) {
            await db_1.connection.execute(`Insert into coinstats_${e.symbol} (price, added) values(${e.price}, NOW())`);
        }
    }
    console.log("coinstats is done");
    for (const e of coinpaprika.data) {
        if (onAllAPIEndpoints.includes(e.symbol)) {
            await db_1.connection.execute(`Insert into coinpaprika_${e.symbol} (price, added) values(${e.quotes.USD.price}, NOW())`);
        }
    }
    console.log("coinpaprika is done");
}
async function schedule() {
    cron.schedule("*/5 * * * *", main);
}
exports.schedule = schedule;
