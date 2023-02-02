"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAllApiEndpoints = exports.main = void 0;
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const key = process.env.key;
const onAllApiEndpoints = [];
exports.onAllApiEndpoints = onAllApiEndpoints;
async function main() {
    console.log("connection in prepare.js", Boolean(db_1.connection));
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
        if (coinbaseSymbols.includes(e) &&
            kucoinSymbols.includes(e) &&
            coinstatsSymbols.includes(e) &&
            coinpaprikaSymbols.includes(e)) {
            counter += 1;
            console.log(counter);
            onAllApiEndpoints.push(e);
            if (counter === 50) {
                await fs_1.default.promises.writeFile("onAllAPIEndpoints.txt", JSON.stringify(onAllApiEndpoints));
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
    console.log(onAllApiEndpoints.length);
    for (const symbol of onAllApiEndpoints) {
        for (const market of markets) {
            try {
                await db_1.connection.execute(`CREATE TABLE IF NOT EXISTS ${market}_${symbol} (
            id int AUTO_INCREMENT,
            price Decimal(40,20),
            added TIMESTAMP,
            PRIMARY KEY(id)
            ); `);
            }
            catch (err) {
                console.log(err);
            }
        }
    }
    console.log("Done");
}
exports.main = main;
