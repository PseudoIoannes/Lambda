const axios = require("axios").default;
const TelegramBot = require("node-telegram-bot-api");

//module.exports = "YOURTOKEN"
const token = require("./.env.js");
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, `Received your message: ${msg.text}`);
  console.log(msg.from.first_name, msg.from.last_name, msg.text);
  if (msg.text.toLowerCase().includes("photo")) {
    axios
      .get("https://picsum.photos/200/300")
      .then((response) => {
        bot.sendPhoto(chatId, response.request._redirectable._currentUrl);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
});
