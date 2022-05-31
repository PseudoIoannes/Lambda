const TelegramBot = require("node-telegram-bot-api");

const { token, id } = require("./.env.js");
const bot = new TelegramBot(token, { polling: true });

async function sendMsg(txt) {
  await bot.sendMessage(id, txt);
}
async function sendPhoto(path) {
  await bot.sendPhoto(id, path);
}

module.exports = { sendMsg: sendMsg, sendPhoto: sendPhoto };
