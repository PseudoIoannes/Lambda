const axios = require("axios").default;
const TelegramBot = require("node-telegram-bot-api");

//module.exports = "YOURTOKEN"
// const token = require("./.env.js");
const token = process.env.token;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Welcome this is simple echo bot, I hope its working...."
  );
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text) {
    bot.sendMessage(chatId, `Received your message: ${msg.text}`);
    console.log(
      msg.from.first_name,
      msg.from.last_name,
      `написал: ${msg.text}`
    );
    if (msg.text.toLowerCase().includes("photo")) {
      axios
        .get("https://picsum.photos/200/300")
        .then((response) => {
          bot.sendPhoto(chatId, response.request._redirectable._currentUrl);
          console.log(msg.from.first_name, msg.from.last_name, "Запросил фото");
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  if (msg.photo) {
    bot.sendPhoto(chatId, msg.photo[msg.photo.length - 1].file_id);
    console.log(msg.from.first_name, msg.from.last_name, "Отправил фото");
    console.log(msg.photo.length);
  }
  if (msg.audio) {
    bot.sendAudio(chatId, msg.audio.file_id);
    console.log(msg.from.first_name, msg.from.last_name, "Отправил аудио");
  }

  if (msg.sticker) {
    bot.sendSticker(chatId, msg.sticker.file_id);
    console.log(msg.from.first_name, msg.from.last_name, "Отправил стикер");
  }
  if (msg.document) {
    console.log(msg);
    bot.sendDocument(chatId, msg.document.file_id);
    console.log(msg.from.first_name, msg.from.last_name, "Отправил документ");
  }
  if (msg.voice) {
    bot.sendVoice(chatId, msg.voice.file_id);
    console.log(msg.from.first_name, msg.from.last_name, "Отправил войс");
  }
  if (msg.video) {
    bot.sendVideo(chatId, msg.video.file_id);
    console.log(msg.from.first_name, msg.from.last_name, "Отправил видео");
  }
  // if (msg.animation) {
  //   console.log(msg);
  //   bot.sendAnimation(chatId, msg.animation.file_id);
  // }
});
