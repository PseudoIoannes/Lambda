const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");

const { jwtReg, jwtAuth } = require("./jwt.js");
const multer = require("multer");
const upload = multer();

const port = process.env.PORT;
const token = process.env.TOKEN;

const app = express();
const bot = new TelegramBot(token, { polling: true });

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.single("photo"));

bot.on("message", function onMessage(msg) {
  bot.sendMessage(msg.chat.id, "I am alive on Heroku!");
});

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `Welcome this is simple echo bot, I hope its working....
    Your login token:`
  );
  bot.sendMessage(msg.chat.id, `${jwtReg(msg.chat.id)}`);
});

app.post("/", (req, res) => {
  try {
    // console.log(req.file);
    // console.log(upload);
    auth_id = jwtAuth(req.headers.jwt_token);

    if (!isNaN(auth_id)) {
      switch (req.headers.type) {
        case "text":
          bot.sendMessage(auth_id, req.body.text);
          break;
        case "photo":
          try {
            bot.sendPhoto(auth_id, req.file.buffer);
          } catch (err) {
            res.json({ err: err.message });
          }
          break;
      }
      res.json({ done: true });
    } else {
      res.json({ err: auth_id });
    }
  } catch (err) {
    res.json({ err: err.message });
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
