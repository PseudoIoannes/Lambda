"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const db = new sqlite3_1.default.Database(":memory:");
db.run("CREATE TABLE list (id INTEGER PRIMARY KEY, favourites TEXT)");
const hype = [
    "BTC",
    "ETH",
    "USDC",
    "XRP",
    "BUSD",
    "ADA",
    "DOGE",
    "SOL",
    "MATIC",
    "DOT",
    "SHIB",
    "LTC",
    "AVAX",
    "UNI",
    "ATOM",
    "LINK",
    "ETC",
    "BCH",
    "XLM",
    "NEAR",
    "LDO",
    "APE",
    "APT",
    "CRO",
    "FIL",
    "QNT",
    "ALGO",
    "HBAR",
    "ICP",
    "MANA",
    "FLOW",
    "AAVE",
    "AXS",
    "SAND",
    "EOS",
    "EGLD",
    "XTZ",
    "CHZ",
    "GRT",
    "ZEC",
    "CRV",
    "MKR",
    "SNX",
    "DASH",
    "IMX",
    "OP",
    "ENJ",
    "1INCH",
    "LRC",
    "RPL",
];
// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.token;
// Create a bot that uses 'polling' to fetch new updates
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.onText(/^\/start$/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    db.get(`SELECT * FROM list WHERE id=${chatId}`, function (err, row) {
        console.log(row);
        if (!row) {
            db.run(`INSERT INTO  list VALUES (${chatId}, "");`);
        }
    });
    bot.sendMessage(chatId, " Hello");
}));
bot.onText(/^\/help (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "TODO");
});
bot.onText(/^\/listRecent$/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    let answer = [];
    for (let symbol of hype) {
        const res = yield axios_1.default.get(`http://127.0.0.1:3000/?symbol=${symbol}&time=5m`);
        answer.push(`/${symbol} $${res.data.data}`);
    }
    console.log(answer);
    bot.sendMessage(chatId, answer.join("\n"));
}));
bot.onText(/^\/listFavourites$/, (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    db.get(`SELECT * FROM list WHERE id=${chatId}`, function (err, row) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(row);
            let favs = row.favourites.split(" ");
            favs.splice(0, 1);
            console.log(favs);
            let answer = [];
            for (let symbol of favs) {
                const res = yield axios_1.default.get(`http://127.0.0.1:3000/?symbol=${symbol}&time=5m`);
                answer.push(`/${symbol} $${res.data.data}`);
            }
            console.log(answer);
            bot.sendMessage(chatId, answer.join("\n") || "Your list is empty");
        });
    });
}));
bot.onText(/^\/addToFavourite (.+)$/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const symbol = match ? match[1] : "";
    if (!hype.includes(symbol.toUpperCase())) {
        bot.sendMessage(chatId, "This symbol is not supported");
    }
    else {
        db.get(`SELECT * FROM list WHERE id=${chatId}`, function (err, row) {
            console.log(row);
            let favs = row.favourites.split(" ");
            console.log(favs);
            if (favs.includes(symbol.toUpperCase())) {
                bot.sendMessage(chatId, `${symbol} is already in list`);
            }
            else {
                favs.push(symbol.toUpperCase());
                console.log(favs);
                db.run(`UPDATE list SET favourites = '${favs.join(" ")}' WHERE id = ${chatId};`);
                bot.sendMessage(chatId, `Succesfully added ${symbol} to list`);
                // bot.answerCallbackQuery(id,{text:`Succesfully added ${data} to list`})
            }
        });
    }
}));
bot.onText(/^\/deleteFavourite (.+)$/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const symbol = match ? match[1] : "";
    if (!hype.includes(symbol.toUpperCase())) {
        bot.sendMessage(chatId, "This symbol is not supported");
    }
    else {
        db.get(`SELECT * FROM list WHERE id=${chatId}`, function (err, row) {
            console.log(row);
            let favs = row.favourites.split(" ");
            console.log(favs);
            if (!favs.includes(symbol.toUpperCase())) {
                bot.sendMessage(chatId, `${symbol} is already not in list`);
            }
            else {
                let i = favs.indexOf(symbol.toUpperCase());
                favs.splice(i, 1);
                console.log(favs);
                db.run(`UPDATE list SET favourites = '${favs.join(" ")}' WHERE id = ${chatId};`);
                bot.sendMessage(chatId, `Succesfully deleted ${symbol} from list`);
            }
        });
    }
    // bot.sendMessage(chatId, "");
}));
bot.onText(/^\/((?!listRecent|start|help|listFavourites|addToFavourite|deleteFavourite).+)/, (msg, match) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    console.log(match);
    const symbol = match ? match[1] : ""; // the captured "whatever"
    if (!hype.includes(symbol.toUpperCase())) {
        bot.sendMessage(chatId, "This symbol is not supported");
    }
    else {
        const times = ["30m", "1h", "3h", "6h", "12h", "24h"];
        let answer = [`Price history for ${symbol}:`];
        for (let time of times) {
            const res = yield axios_1.default.get(`http://127.0.0.1:3000/?symbol=${symbol}&time=${time}`);
            answer.push(`${time}: ${res.data.data}`);
        }
        const opts = {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Add/Remove to/from following",
                            callback_data: symbol.toUpperCase(),
                        },
                    ],
                ],
            },
        };
        // send back the matched "whatever" to the chat
        bot.sendMessage(chatId, answer.join("\n"), opts);
    }
}));
bot.on("callback_query", function onCallbackQuery(callbackQuery) {
    const id = callbackQuery.id;
    const data = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id; // how can it be undefined?
    db.get(`SELECT * FROM list WHERE id=${chatId}`, function (err, row) {
        console.log(row);
        let favs = row.favourites.split(" ");
        console.log(favs);
        if (favs.includes(data)) {
            let i = favs.indexOf(data);
            favs.splice(i, 1);
            db.run(`UPDATE list SET favourites = '${favs.join(" ")}' WHERE id = ${chatId};`);
            // bot.sendMessage(chatId,`Succesfully deleted ${data} from list`);
            bot.answerCallbackQuery(id, { text: `Succesfully deleted ${data} from list` });
        }
        else {
            favs.push(data);
            console.log(favs);
            db.run(`UPDATE list SET favourites = '${favs.join(" ")}' WHERE id = ${chatId};`);
            // bot.sendMessage(chatId,`Succesfully added ${data} to list`);
            bot.answerCallbackQuery(id, { text: `Succesfully added ${data} to list` });
        }
    });
    console.log(data, chatId);
});
bot.on("polling_error", console.log); //catch syntax errors
