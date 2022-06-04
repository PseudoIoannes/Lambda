const { program } = require("commander");
const fs = require("fs").promises;
const axios = require("axios").default;
const FormData = require("form-data");
const cRS = require("fs").createReadStream;

async function main() {
  program
    .command("login <JWT_token>")
    .description("Logins your console to your tg by creating a jwt token file")
    .action(writeToken)
    .addHelpText(
      "after",
      `example:
        node app.js login Your_JWT_token`
    );

  program
    .command("message <text>")
    .description("Send a message to telegram")
    .action(sendMsg)
    .addHelpText(
      "after",
      `example:
        node app.js message ‘Your message’`
    );

  program
    .command("photo <path>")
    .description("Send a photo to telegram (only local files)")
    .action(sendPhoto)
    .addHelpText(
      "after",
      `example:
        node app.js photo /path/to/photo/picture.png`
    );

  await program.parseAsync();
  process.exit();
}
main();

async function writeToken(token) {
  await fs.writeFile("jwt_token", `${token}`, {
    flag: "w",
  });
}

async function readToken() {
  try {
    let token = await fs.readFile("jwt_token", {
      flag: "r",
      encoding: "utf8",
    });
    return token;
  } catch (err) {
    if (err.errno === -4058) {
      console.log(
        "Please login before using app, seems like you dont have token file created yet :/"
      );
    } else {
      console.log(err.message);
    }
  }
}

async function sendMsg(text) {
  let jwt_token = await readToken();

  await axios
    .post(
      "https://tg-console-sender-bot.herokuapp.com/",
      {
        text,
      },
      {
        headers: {
          jwt_token: jwt_token,
          type: "text",
        },
      }
    )
    .then(function (response) {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function sendPhoto(photo) {
  let jwt_token = await readToken();

  let readStream = cRS(photo);
  let form = new FormData();
  form.append("photo", readStream);

  await axios
    .post("https://tg-console-sender-bot.herokuapp.com/", form, {
      headers: {
        ...form.getHeaders(),
        jwt_token: jwt_token,
        type: "photo",
      },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}
