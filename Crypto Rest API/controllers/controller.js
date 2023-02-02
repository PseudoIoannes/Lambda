"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.controller = void 0;
const db_1 = require("../db");
const controller = async (req, res) => {
    console.log("controller", Boolean(db_1.connection));
    const { symbol, market, time } = req.query;
    let timeForSQL;
    if (typeof time === "string") {
        let extension = time.slice(-1);
        const timeAmmount = Number(time.slice(0, -1));
        switch (extension) {
            case 'm':
                extension = "minute";
                break;
            case 'h':
                extension = "hour";
                break;
            default:
                extension = "minute";
        }
        timeForSQL = timeAmmount + " " + extension;
        console.log(timeForSQL);
    }
    let markets = [];
    if (!market) {
        markets = [
            "coinmarketcap",
            "coinbase",
            "kucoin",
            "coinstats",
            "coinpaprika",
        ];
    }
    else {
        markets = [market];
    }
    const prices = [];
    for (const market of markets) {
        try {
            const symbolupper = typeof symbol === "string" ? symbol.toUpperCase() : symbol;
            const [rows] = await db_1.connection.execute(`SELECT    *
        FROM      ${market}_${symbolupper}
        WHERE added >= DATE_SUB(now(),INTERVAL ${timeForSQL})
        ORDER BY  id DESC
        ;`);
            for (const e of rows) {
                prices.push(Number(e.price));
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    const init = 0;
    let total = prices.reduce((acc, currVal) => acc + currVal, init);
    total = total / prices.length; // undefined
    res.json({ "data": total });
};
exports.controller = controller;
