"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTime = exports.validateMarket = exports.validateSymbol = void 0;
const prepare_1 = require("../prepare");
const validateSymbol = async (req, res, next) => {
    // const onAllAPIEndpointsStr = await fs.promises.readFile(
    //   "onAllAPIEndpoints.txt",
    //   "utf-8"
    // );
    // const symbols = await JSON.parse(onAllAPIEndpointsStr);
    const symbols = prepare_1.onAllApiEndpoints;
    // console.log(symbols)
    const { symbol } = req.query;
    if (typeof symbol === "string") {
        if (!symbols.includes(symbol.toUpperCase())) {
            res.json({ "error": "symbol not in db" });
        }
        else {
            next();
        }
    }
    else {
        res.json({ "error": "No symbol provided" });
    }
};
exports.validateSymbol = validateSymbol;
const validateMarket = async (req, res, next) => {
    const { market } = req.query;
    const markets = [
        "coinmarketcap",
        "coinbase",
        "kucoin",
        "coinstats",
        "coinpaprika",
    ];
    if (typeof market === "string") {
        if (markets.includes(market)) {
            next();
        }
        else {
            res.json({ "error": "invalid market name, try coinmarketcap coinbase kucoin coinstats coinpaprika" });
        }
    }
    else {
        next(); // no market provided is ok
    }
};
exports.validateMarket = validateMarket;
const validateTime = async (req, res, next) => {
    const { time } = req.query;
    if (typeof time === "string") {
        const extension = time.slice(-1);
        const timeAmmount = Number(time.slice(0, -1));
        if ((extension !== "m" && extension !== "h") || isNaN(timeAmmount) || timeAmmount === 0) {
            res.json({ "error": "Cant parse time" });
        }
        else {
            next();
        }
    }
    else {
        res.json({ "error": "No time period provided" });
    }
};
exports.validateTime = validateTime;
