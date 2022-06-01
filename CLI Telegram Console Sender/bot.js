const TelegramBot = require("node-telegram-bot-api");
const bot = new TelegramBot(token, { polling: true });

const { jwt_register, jwt_auth, read_token } = require("./jwt.js");
const { token } = require("./.env.js");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Welcome this is simple echo bot, I hope its working....
    Your login token:`
  );
  bot.sendMessage(msg.chat.id, `${jwt_register(msg.chat.id)}`);
});

async function sendMsg(txt) {
  let jwt_token = await read_token();
  id = await jwt_auth(jwt_token);
  if (id) {
    await bot.sendMessage(id, txt);
  } else {
    console.log("Jwt failed, abort action");
  }
}

async function sendPhoto(path) {
  try {
    let jwt_token = await read_token();
    id = await jwt_auth(jwt_token);
    if (id) {
      await bot.sendPhoto(id, path);
    } else {
      console.log("Jwt failed, abort action");
    }
  } catch (error) {
    console.error(`Got an error trying to upload a photo: ${error.message}`);
  }
}

module.exports = { sendMsg: sendMsg, sendPhoto: sendPhoto };
