const { program } = require("commander");
const { sendMsg, sendPhoto } = require("./bot.js");
const { write_token } = require("./jwt.js");

async function main() {
  program
    .command("login <JWT_token>")
    .description("Logins your console to your tg by creating a jwt token file")
    .action(write_token)
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
